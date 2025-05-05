export async function getSessionsInfo(token) {
  const res = await fetch(
    "https://vision-backend-32ia.onrender.com/sessions-info",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();
  console.log("User Info:");
  console.log(data);
  return data.count;
}
export async function getSessionsInfoToday(token) {
  const res = await fetch(
    "https://vision-backend-32ia.onrender.com/sessions-info-today",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();
  return data;
}
export async function getSessionsCount(token) {
  const res = await fetch(
    "https://vision-backend-32ia.onrender.com/sessions-info-count",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();
  // console.log("User Count:", data);
  return data.count;
}
export async function getSyncInfo(token) {
  const res = await fetch(
    "https://vision-backend-32ia.onrender.com/sync-info",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();
  console.log("Sync Info:");
  console.log(data);
  return data.count;
}
export async function getSyncInfoCount(token) {
  const res = await fetch(
    "https://vision-backend-32ia.onrender.com/sync-info-count",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();
  console.log("Sync Info Count:", data.count);
  return data.count;
}
export async function getUserMappingsByEmail(token, user) {
  const res = await fetch(
    `https://vision-backend-32ia.onrender.com/user-mappings-by-email?user=${user}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();
  // console.log("UserMapings:");
  // console.log(data);
  return data;
}
export async function getPluginUse(token) {
  const res = await fetch(
    "https://vision-backend-32ia.onrender.com/plugin-use",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();
  console.log("Plugin Use:");
  console.log(data);
  return data.count;
}
export async function getPluginUseCount(token) {
  const res = await fetch(
    "https://vision-backend-32ia.onrender.com/plugin-use-count",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();
  console.log("Plugin Use Count:", data.count);
  return data.count;
}
export async function getViewBookmarks(token) {
  const res = await fetch(
    "https://vision-backend-32ia.onrender.com/view-bookmarks",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();
  console.log("View Bookmarks:");
  console.log(data);
  return data.count;
}
