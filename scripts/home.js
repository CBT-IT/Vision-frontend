import {
  getUserCount,
  getUserMappings,
  getUserInfo,
  getSyncInfo,
  getSyncInfoCount,
  getPluginUse,
  getPluginUseCount,
  getViewBookmarks,
} from "../utility/backendCalls.js";

const token = sessionStorage.getItem("idToken");
const user = sessionStorage.getItem("userEmail");

async function initHomepage() {
  if (!token) {
    window.location.href = "../index.html";
    return;
  }
  const userInfo = await getUserInfo(token);
  const userInfoCount = await getUserCount(token);
  const userMappings = await getUserMappings(token);
  const syncInfo = await getSyncInfo(token);
  const syncInfoCount = await getSyncInfoCount(token);
  const pluginUse = await getPluginUse(token);
  const pluginUseCount = await getPluginUseCount(token);
  const viewBookmarks = await getViewBookmarks(token);

  // console.log(users);
  document.getElementById("user").innerHTML = user;
  // document.getElementById("count").innerHTML = count;
  document.getElementById("logout-button").addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "../index.html";
  });
}

initHomepage();
