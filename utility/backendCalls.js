import { safeFetch } from "./utils.js";
const backendURL_PROD = "https://vision-backend-32ia.onrender.com";
const backendURL_DEV = "http://localhost:5000";

export async function getSessionsInfo(token) {
  return await safeFetch(`${backendURL_DEV}/sessions-info`, token);
}
export async function getUserCount(token) {
  return await safeFetch(`${backendURL_DEV}/user-count`, token);
}
export async function getUsers(token) {
  return await safeFetch(`${backendURL_DEV}/users`, token);
}
export async function getSessionsInfoToday(token) {
  return await safeFetch(`${backendURL_DEV}/sessions-info-today`, token);
}
export async function getSessionsCount(token) {
  const data = await safeFetch(`${backendURL_DEV}/sessions-info-count`, token);
  return data.count;
}
export async function getSyncInfo(token) {
  return await safeFetch(`${backendURL_DEV}/sync-info`, token);
}
export async function getSyncInfoCount(token) {
  const data = await safeFetch(`${backendURL_DEV}/sync-info-count`, token);
  return data.count;
}
export async function getSyncInfoToday(token) {
  return await safeFetch(`${backendURL_DEV}/sync-info-today`, token);
}
export async function getUserMappingsByEmail(token, user) {
  return await safeFetch(
    `${backendURL_DEV}/user-mappings-by-email?user=${user}`,
    token
  );
}
export async function getPluginUse(token) {
  const data = await safeFetch(`${backendURL_DEV}/plugin-use`, token);
  return data.count;
}
export async function getPluginUseToday(token) {
  return await safeFetch(`${backendURL_DEV}/plugin-use-today`, token);
}
export async function getPluginUseCount(token) {
  const data = await safeFetch(`${backendURL_DEV}/plugin-use-count`, token);
  return data.count;
}
export async function getViewBookmarks(token) {
  const data = await safeFetch(`${backendURL_DEV}/view-bookmarks`, token);
  return data.count;
}
export async function getActiveUsers(token) {
  return await safeFetch(`${backendURL_DEV}/active-users`, token);
}
export async function getActiveUsersCount(token) {
  return await safeFetch(`${backendURL_DEV}/active-users-count`, token);
}
export async function getActivityChartData(token) {
  return await safeFetch(`${backendURL_DEV}/activity-chart-data`, token);
}
export async function getCloudProjectsCount(token) {
  return await safeFetch(`${backendURL_DEV}/cloud-projects-count`, token);
}
export async function getCloudProjects(token) {
  return await safeFetch(`${backendURL_DEV}/cloud-projects`, token);
}
export async function getCloudProjectsUsers(token, project) {
  return await safeFetch(
    `${backendURL_DEV}/cloud-projects-users?project=${project}`,
    token
  );
}
export async function getModelsTrackedCount(token) {
  return await safeFetch(`${backendURL_DEV}/models-tracked-count`, token);
}
export async function getUserMappingsByAutodesk(token) {
  return await safeFetch(`${backendURL_DEV}/user-mappings-by-autodesk`, token);
}
export async function getSyncsInSession(token, id) {
  return await safeFetch(
    `${backendURL_DEV}/syncs-in-session?sessionId=${id}`,
    token
  );
}
export async function getLastUserEntry(token, user) {
  return await safeFetch(
    `${backendURL_DEV}/last-user-entry?user=${encodeURIComponent(user)}`,
    token
  );
}
export async function getModelsTracked(token) {
  return await safeFetch(`${backendURL_DEV}/models-tracked`, token);
}
export function getUserImage(userName) {
  return `${backendURL_DEV}/user_images/${userName}.jpg`;
}
