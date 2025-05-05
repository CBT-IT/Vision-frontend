import {
  getSessionsCount,
  getUserMappingsByEmail,
  getSessionsInfoToday,
  getSyncInfoToday,
  getPluginUseCount,
  getPluginUseToday,
  getSessionsInfo,
  getSyncInfo,
  getSyncInfoCount,
  getPluginUse,
  getViewBookmarks,
} from "../utility/backendCalls.js";

const token = sessionStorage.getItem("idToken");
const user = sessionStorage.getItem("userEmail");
const loading_screen = document.getElementById("loading-message");
const main_container = document.getElementById("main-container");

async function initHomepage() {
  if (!token) {
    window.location.href = "../index.html";
    return;
  }
  try {
    main_container.style.display = "none";
    loading_screen.style.display = "flex";

    // const userInfo = await getUserInfo(token);
    // const userInfoCount = await getUserCount(token);

    // const syncInfo = await getSyncInfo(token);
    // const syncInfoCount = await getSyncInfoCount(token);
    // const pluginUse = await getPluginUse(token);
    // const pluginUseCount = await getPluginUseCount(token);
    // const viewBookmarks = await getViewBookmarks(token);
    // console.log(userMappings);

    await updatePage();
    await sleep(1000);
    loading_screen.style.display = "none";
    main_container.style.display = "flex";
  } catch (err) {
    alert("Error Loading: " + err.message);
  }
}

async function updatePage() {
  //add navbar
  const navres = await fetch("/components/navbar.html");
  const navHTML = await navres.text();
  document.getElementById("navbar-placeholder").innerHTML = navHTML;

  const user_name = document.getElementById("user-name");
  const userMappings = await getUserMappingsByEmail(token, user);
  // console.log(userMappings);
  user_name.innerHTML = `Welcome,<br>${userMappings.userFilter.fullName}`;

  document.getElementById("logout-button").addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "../index.html";
  });

  document.getElementById("refresh-button").addEventListener("click", () => {
    initHomepage();
  });

  await populateSessionsCard();
  await populateSyncsCard();
  await populatePluginCard();
}

async function populateSessionsCard() {
  const sessionsToday = await getSessionsInfoToday(token);
  const sessionsTodayCount = sessionsToday.sessionsInfo.length;
  const sessionsCount = await getSessionsCount(token);
  const sessions_button_data = document.getElementById("sessions-button-data");
  const sessions_button_summary = document.getElementById(
    "sessions-button-summary"
  );
  sessions_button_data.textContent = sessionsCount;
  sessions_button_summary.textContent = `+${sessionsTodayCount}`;
}

async function populateSyncsCard() {
  const syncCount = await getSyncInfoCount(token);
  const syncs_button_data = document.getElementById("syncs-button-data");
  syncs_button_data.textContent = syncCount;

  const syncInfoToday = await getSyncInfoToday(token);
  const syncs_button_summary = document.getElementById("syncs-button-summary");
  syncs_button_summary.textContent = `+${syncInfoToday.syncInfo.length}`;
}
async function populatePluginCard() {
  const pluginCount = await getPluginUseCount(token);
  const plugin_button_data = document.getElementById("plugin-button-data");
  plugin_button_data.textContent = pluginCount;

  const pluginUseToday = await getPluginUseToday(token);
  const plugin_button_summary = document.getElementById(
    "plugin-button-summary"
  );
  plugin_button_summary.textContent = `+${pluginUseToday.pluginUse.length}`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

initHomepage();
