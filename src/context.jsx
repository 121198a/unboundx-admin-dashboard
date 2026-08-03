import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, XCircle, X, Info } from 'lucide-react';
import { authApi } from './api/api';
import { STORAGE_KEYS } from './constants';


// ---------------------------------------------------------------------
// AUTH — who is logged in, and the login()/logout() actions
// ---------------------------------------------------------------------
const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser());
  const [token, setToken] = useState(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN));
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    setInitializing(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await authApi.login({ email, password });
    const payload = response?.data ?? response;

    const accessToken = payload?.access_token || payload?.accessToken || payload?.token || payload?.jwt;
    const refreshToken = payload?.refresh_token || payload?.refreshToken || payload?.refresh;
    const nextUser = payload?.user || payload?.admin || null;

    if (!accessToken) {
      console.error('UnboundX: login response did not match expected fields. Raw response:', payload);
      throw new Error(
        'The server response did not include an access token. Open the browser console (F12) to see the raw response and check the field name.'
      );
    }

    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    if (refreshToken) localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    if (nextUser) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(nextUser));

    setToken(accessToken);
    setUser(nextUser);
    return payload;
  }, []);

  const logout = useCallback(() => {

  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);

  setToken(null);
  setUser(null);
}, []);

  const value = useMemo(
    () => ({ user, token, isAuthenticated: Boolean(token), initializing, login, logout }),
    [user, token, initializing, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

// ---------------------------------------------------------------------
// TOAST — small pop-up notifications, e.g. showToast('Saved!', 'success')
// ---------------------------------------------------------------------
const ToastContext = createContext(null);

const TOAST_ICONS = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
};

function Toast({ message, type = 'success', onClose }) {
  return (
    <div className="flex min-w-280px max-w-sm items-start gap-3 rounded-xl border border-(--ux-border) bg-white p-4 shadow-lg">
      {TOAST_ICONS[type] || TOAST_ICONS.info}
      <p className="flex-1 text-sm text-(--ux-text)">{message}</p>
      <button onClick={onClose} aria-label="Dismiss notification" className="text-gray-400 hover:text-gray-600">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'success', duration = 3500) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-5 right-5 z-100 flex flex-col gap-2">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
