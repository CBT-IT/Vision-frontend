import { safeFetch } from "./utils.js";

export async function getSessionsInfo(token) {
  return await safeFetch(
    "https://vision-backend-32ia.onrender.com/sessions-info",
    token
  );
}
export async function getUserCount(token) {
  return await safeFetch(
    "https://vision-backend-32ia.onrender.com/user-count",
    token
  );
}
export async function getSessionsInfoToday(token) {
  return await safeFetch(
    "https://vision-backend-32ia.onrender.com/sessions-info-today",
    token
  );
}
export async function getSessionsCount(token) {
  const data = await safeFetch(
    "https://vision-backend-32ia.onrender.com/sessions-info-count",
    token
  );
  return data.count;
}
export async function getSyncInfo(token) {
  return await safeFetch(
    "https://vision-backend-32ia.onrender.com/sync-info",
    token
  );
}
export async function getSyncInfoCount(token) {
  const data = await safeFetch(
    "https://vision-backend-32ia.onrender.com/sync-info-count",
    token
  );
  return data.count;
}
export async function getSyncInfoToday(token) {
  return await safeFetch(
    "https://vision-backend-32ia.onrender.com/sync-info-today",
    token
  );
}
export async function getUserMappingsByEmail(token, user) {
  return await safeFetch(
    `https://vision-backend-32ia.onrender.com/user-mappings-by-email?user=${user}`,
    token
  );
}
export async function getPluginUse(token) {
  const data = await safeFetch(
    "https://vision-backend-32ia.onrender.com/plugin-use",
    token
  );
  return data.count;
}
export async function getPluginUseToday(token) {
  return await safeFetch(
    "https://vision-backend-32ia.onrender.com/plugin-use-today",
    token
  );
}
export async function getPluginUseCount(token) {
  const data = await safeFetch(
    "https://vision-backend-32ia.onrender.com/plugin-use-count",
    token
  );
  return data.count;
}
export async function getViewBookmarks(token) {
  const data = await safeFetch(
    "https://vision-backend-32ia.onrender.com/view-bookmarks",
    token
  );
  return data.count;
}
export async function getActiveUsersCount(token) {
  return await safeFetch(
    "https://vision-backend-32ia.onrender.com/active-users-count",
    token
  );
}
export async function getActivityChartData(token) {
  return await safeFetch(
    "https://vision-backend-32ia.onrender.com/activity-chart-data",
    token
  );
}
export async function getCloudProjectsCount(token) {
  return await safeFetch(
    "https://vision-backend-32ia.onrender.com/cloud-projects-count",
    token
  );
}
export async function getModelsTrackedCount(token) {
  return await safeFetch(
    "https://vision-backend-32ia.onrender.com/models-tracked-count",
    token
  );
}
export async function getUserMappingsByAutodesk(token) {
  return await safeFetch(
    "https://vision-backend-32ia.onrender.com/user-mappings-by-autodesk",
    token
  );
}
export async function getSyncsInSession(token, id) {
  return await safeFetch(
    `https://vision-backend-32ia.onrender.com/syncs-in-session?sessionId=${id}`,
    token
  );
}
export async function getModelsTracked(token) {
  return await safeFetch(
    "https://vision-backend-32ia.onrender.com/models-tracked",
    token
  );
}
