import { request } from "../utils/request";

export const auth = {
  login: (data) => request("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  register: (data) => request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  logout: () => request("/auth/logout", { method: "POST", credentials: "include" }),
  logoutAll: () => request("/auth/logout-all", { method: "POST", credentials: "include" }),
  refresh: () => request("/auth/refresh", { method: "POST", credentials: "include" }),
  forgotPassword: (email) =>
    request("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
  resetPassword: (token, newPassword) =>
    request("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, newPassword }) })
};

export const announcementsApi = {
  list: () => request("/announcements"),
  create: (data) => request("/announcements", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/announcements/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/announcements/${id}`, { method: "DELETE" })
};

export const reportsApi = {
  create: (data) => request("/reports", { method: "POST", body: JSON.stringify(data) }),
  mine: () => request("/reports/my"),
  adminList: () => request("/admin/reports"),
  adminUpdateStatus: (id, status) =>
    request(`/admin/reports/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
  adminRemove: (id) => request(`/admin/reports/${id}`, { method: "DELETE" })
};

export const schedulesApi = {
  list: () => request("/schedules"),
  create: (data) => request("/schedules", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/schedules/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/schedules/${id}`, { method: "DELETE" })
};

export const tipsApi = {
  list: () => request("/tips"),
  create: (data) => request("/tips", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/tips/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/tips/${id}`, { method: "DELETE" })
};

export const adminUsersApi = {
  list: () => request("/admin/users"),
  updateStatus: (id, status) =>
    request(`/admin/users/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  remove: (id) => request(`/admin/users/${id}`, { method: "DELETE" })
};
