import apiClient from './apiClient';
import { buildPaginationParams, extractList } from '../utils/apiShape';
import { ENDPOINTS } from '../config/appConfig';

/**
 * =====================================================================
 * ALL API CALLS LIVE HERE. 
 * =====================================================================
 */

/* ==========================================================
   AUTH API
========================================================== */

export const authApi = {
  // POST /api/user-service/user/admin-login  { email, password }
  login: (payload) =>
    apiClient.post(ENDPOINTS.login, payload, { skipAuthRedirect: true }).then((r) => r.data),
};

/* ==========================================================
   USER API
========================================================== */

export const userApi = {
  // GET /api/users/getUserListing
  list: ({ page, pageSize, search, signal }) => {
    const params = { page, size: pageSize };
    if (search?.trim()) {
      params.keyword = search.trim();
    }
    return apiClient
      .get(ENDPOINTS.usersList, { params, signal })
      .then((r) => r.data);
  },

  // DELETE /api/users/deleteUser
  remove: (id) =>
    apiClient.delete(`${ENDPOINTS.usersDelete}/${id}`).then((r) => r.data),
};

/* ==========================================================
   GENERIC RESOURCE API FACTORY
     GET    /path            -> list (paginated)
     GET    /path/:id        -> one record
     POST   /path            -> create
     PUT    /path/:id        -> update
     DELETE /path/:id        -> delete
========================================================== */

export function createResourceApi(path) {
  return {
    list: ({ page, pageSize, search, signal }) =>
      apiClient
        .get(path, {
          params: buildPaginationParams({ page, pageSize, search }),
          signal,
        })
        .then((r) => r.data),

    get: (id) => apiClient.get(`${path}/${id}`).then((r) => r.data),

    create: (payload) => apiClient.post(path, payload).then((r) => r.data),

    update: (id, payload) => apiClient.put(`${path}/${id}`, payload).then((r) => r.data),

    remove: (id) => apiClient.delete(`${path}/${id}`).then((r) => r.data),
  };
}

/* ==========================================================
   STANDARD CRUD MODULES
========================================================== */

export const activityApi = createResourceApi(ENDPOINTS.activities);
export const competitionApi = createResourceApi(ENDPOINTS.competitions);
export const missionApi = createResourceApi(ENDPOINTS.missions);
export const notificationApi = createResourceApi(ENDPOINTS.notifications);
export const algorithmApi = createResourceApi(ENDPOINTS.manageAlgorithm);
export const categoryApi = createResourceApi(ENDPOINTS.category);
export const interactionPointsApi = createResourceApi(ENDPOINTS.manageInteractionPoints);
export const portfolioApi = createResourceApi(ENDPOINTS.portfolios);
export const reportApi = createResourceApi(ENDPOINTS.reportManagement);
export const stockPollApi = createResourceApi(ENDPOINTS.stockPoll);
export const widgetApi = createResourceApi(ENDPOINTS.widgets);
export const shortEmbeddedVideoApi = createResourceApi(ENDPOINTS.shortEmbeddedVideo);

/* ==========================================================
   LEVEL ACTIVITY API 
========================================================== */

export const levelActivityApi = {
  // GET /api/users/levels
  list: ({ signal }) =>
    apiClient
      .get(ENDPOINTS.levelActivity, { signal })
      .then((r) => r.data),


  get: async (id) => {
    const { data } = await apiClient.get(ENDPOINTS.levelActivity);
    const list = extractList(data);
    const match = list.find((row) => String(row.id ?? row._id) === String(id));
    if (!match) {
      throw new Error(`Level activity not found: ${id}`);
    }
    return match;
  },

  // POST /api/users/create-level
  create: (payload) =>
    apiClient
      .post(ENDPOINTS.levelActivityCreate, {
        name: payload.name,
        order: payload.order,
        description: payload.description,
        maxXp: payload.tasks.reduce((sum, t) => sum + Number(t.xp || 0), 0),
        tasks: payload.tasks.map((t) => ({
          title: t.title,
          description: t.description,
          requiredCount: Number(t.required_count ?? t.requiredCount ?? 0),
          xp: Number(t.xp || 0),
          module: Number(t.module),
        })),
      })
      .then((r) => r.data),

  // PUT /api/users/edit-level
  update: (id, payload) =>
    apiClient
      .put(ENDPOINTS.levelActivityUpdate, {
        levelId: id,
        name: payload.name,
        // NOTE: unlike create-level, edit-level rejects "order" outright
        // (confirmed 400: "order is not allowed") — don't send it here.
        description: payload.description,
        maxXp: payload.tasks.reduce((sum, t) => sum + Number(t.xp || 0), 0),
        tasks: payload.tasks.map((t) => ({
          taskId: t.taskId ?? t.id,
          title: t.title,
          description: t.description,
          requiredCount: Number(t.required_count ?? t.requiredCount ?? 0),
          xp: Number(t.xp || 0),
          module: Number(t.module),
        })),
      })
      .then((r) => r.data),



  deleteTask: (levelId, taskId) =>
    apiClient.put(ENDPOINTS.levelActivityDeleteTask, { levelId, taskId }).then((r) => r.data),
};

export const zenithAuditApi = createResourceApi(ENDPOINTS.zenithAudit);
export const serverMaintenanceApi = createResourceApi(ENDPOINTS.serverMaintenance);
export const waitListApi = createResourceApi(ENDPOINTS.waitList);
export const appVersionApi = createResourceApi(ENDPOINTS.appVersion);
export const resourcesApi = createResourceApi(ENDPOINTS.resources);
export const marketingEmailApi = createResourceApi(ENDPOINTS.marketingEmail);
export const marketingApi = createResourceApi(ENDPOINTS.marketing);


