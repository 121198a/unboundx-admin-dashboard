import axios from 'axios';
import { STORAGE_KEYS, AUTH_STRATEGY } from '../constants';
import { BASE_URL, API_KEY, AUTH_TYPE, REQUEST_TIMEOUT } from '../config/appConfig';

const AUTH_STRATEGY_CONFIG = AUTH_TYPE || AUTH_STRATEGY.BEARER;
const TIMEOUT = REQUEST_TIMEOUT;

export class ApiError extends Error {
  constructor({ message, status = null, code = 'UNKNOWN', details = null }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code; // e.g. 'NETWORK', 'TIMEOUT', 'CORS', 'UNAUTHORIZED', 'FORBIDDEN', 'NOT_FOUND', 'SERVER', 'INVALID_TOKEN', 'INVALID_API_KEY'
    this.details = details;
  }
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  withCredentials: AUTH_STRATEGY_CONFIG === AUTH_STRATEGY.COOKIE,
});

// ---- Request interceptor ----
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  switch (AUTH_STRATEGY_CONFIG) {
    case AUTH_STRATEGY.BEARER:
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      break;

    case AUTH_STRATEGY.API_KEY:
      if (API_KEY) {
        config.headers['x-api-key'] = API_KEY;
      }
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      break;

    case AUTH_STRATEGY.BASIC:
      if (token) {
        config.headers.Authorization = `Basic ${token}`;
      }
      break;

    case AUTH_STRATEGY.COOKIE:
      break;

    default:
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
  }

  // API Key
  if (API_KEY && !config.headers['x-api-key']) {
    config.headers['x-api-key'] = API_KEY;
  }


  config.headers['Accept'] = 'application/json';
  config.headers['api-version'] = 'v1';
  config.headers['x-custom-lang'] = 'en';

  return config;
});

let isLoggingOut = false;

function forceLogout() {
  if (isLoggingOut) return;
  isLoggingOut = true;
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  window.location.href = '/login';
}

// ---- Response interceptor ----
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
      return Promise.reject(new ApiError({ message: 'Request canceled', code: 'CANCELED' }));
    }

    // Network error / CORS / DNS failure: axios gives no `response` object.
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return Promise.reject(
          new ApiError({
            message: 'The request timed out. Please check your connection and try again.',
            code: 'TIMEOUT',
          })
        );
      }
      if (!navigator.onLine) {
        return Promise.reject(
          new ApiError({ message: 'No internet connection detected.', code: 'NO_INTERNET' })
        );
      }
      return Promise.reject(
        new ApiError({
          message:
            'Could not reach the server. This is usually a backend CORS issue (missing Access-Control-Allow-Origin), an incorrect VITE_API_BASE_URL, a missing/invalid SSL certificate, or the API being offline.',
          code: 'NETWORK_OR_CORS',
        })
      );
    }

    const { status, data } = error.response;
    const serverMessage = data?.message || data?.error || null;
    const skipAuthRedirect = error.config?.skipAuthRedirect === true;

    switch (status) {
      case 401:
        if (!skipAuthRedirect) forceLogout();
        return Promise.reject(
          new ApiError({
            message: serverMessage || 'Your session has expired or the token is invalid. Please sign in again.',
            status,
            code: 'INVALID_TOKEN',
            details: data,
          })
        );
      case 403:
        return Promise.reject(
          new ApiError({
            message: serverMessage || 'You do not have permission to perform this action.',
            status,
            code: 'FORBIDDEN',
            details: data,
          })
        );
      case 404:
        return Promise.reject(
          new ApiError({
            message: serverMessage || 'The requested resource was not found.',
            status,
            code: 'NOT_FOUND',
            details: data,
          })
        );
      case 422:
        return Promise.reject(
          new ApiError({
            message: serverMessage || 'Some fields are invalid. Please review and try again.',
            status,
            code: 'VALIDATION',
            details: data,
          })
        );
      case 500:
      case 502:
      case 503:
        return Promise.reject(
          new ApiError({
            message: serverMessage || 'The server encountered an error. Please try again shortly.',
            status,
            code: 'SERVER',
            details: data,
          })
        );
      default:
        return Promise.reject(
          new ApiError({
            message: serverMessage || `Request failed with status ${status}.`,
            status,
            code: 'UNKNOWN',
            details: data,
          })
        );
    }
  }
);

export default apiClient;
