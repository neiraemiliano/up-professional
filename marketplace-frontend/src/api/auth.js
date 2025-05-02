import api from "./client";

export const register = (data) =>
  api.post("/auth/register", data).then((r) => r.data);
export const login = (creds) =>
  api.post("/auth/login", creds).then((r) => r.data);

export function setToken(token) {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}
export function clearToken() {
  delete api.defaults.headers.common.Authorization;
}
