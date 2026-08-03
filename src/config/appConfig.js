/**
 * ===============================================================
 * UNBOUNDX APP CONFIG
 * ===============================================================
 */

// ---------------------------------------------------------------------
// 1) BASE URL
// ---------------------------------------------------------------------
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

if (!BASE_URL && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn(
    "UnboundX: VITE_API_BASE_URL is not set. Copy .env.example to .env and set it, " +
      "or configure it in your Vercel project's Environment Variables."
  );
}

// ---------------------------------------------------------------------
// 2) AUTH TYPE
// ---------------------------------------------------------------------
export const AUTH_TYPE =
  import.meta.env.VITE_AUTH_STRATEGY || "bearer";

// ---------------------------------------------------------------------
// 3) API KEY
// ---------------------------------------------------------------------
export const API_KEY =
  import.meta.env.VITE_API_KEY || "";

// ---------------------------------------------------------------------
// 4) ENDPOINTS
// ---------------------------------------------------------------------
export const ENDPOINTS = {
  // =========================
  // AUTH
  // =========================
  login: "/api/user-service/user/admin-login",

  // =========================
  // USERS
  // =========================
  usersList: "/api/users/getUserListing",
  usersDelete: "/api/users/deleteUser",

  // =========================
  // OTHER MODULES
  // =========================

  activities: "/api/activities",
  competitions: "/api/competitions",
  missions: "/api/missions",
  widgets: "/api/widgets",
  portfolios: "/api/portfolios",
  manageInteractionPoints: "/api/manage-interaction-points",
  manageAlgorithm: "/api/manage-algorithm",
  stockPoll: "/api/stock-poll",
  notifications: "/api/notifications",
  category: "/api/category",
  reportManagement: "/api/report-management",
  shortEmbeddedVideo: "/api/short-embedded-videos",

  // =========================
  // LEVEL ACTIVITY
  // =========================

  levelActivity: "/api/users/levels",
  levelActivityCreate: "/api/users/create-level",
  levelActivityUpdate: "/api/users/edit-level",
  levelActivityDeleteTask: "/api/users/delete-task",

  zenithAudit: "/api/zenith-audit",
  serverMaintenance: "/api/server-maintenance",
  waitList: "/api/wait-list",
  appVersion: "/api/app-version",
  resources: "/api/resources",
  marketingEmail: "/api/marketing-email",
  marketing: "/api/marketing",
};

// ---------------------------------------------------------------------
// 5) REQUEST TIMEOUT
// ---------------------------------------------------------------------
export const REQUEST_TIMEOUT =
  Number(import.meta.env.VITE_API_TIMEOUT) || 15000;