import {
  getUserMappingsByEmail,
  getPluginUse,
  getActivePlugins,
  getPluginCountToday,
} from "../utility/backendCalls.js";
import { validateSession, redirectToLogin } from "../utility/auth.js";
import {
  sleep,
  loadNavbar,
  toggleLoading,
  renderUserWelcome,
} from "../utility/utils.js";

let token, user, userMappings, activePlugins, entries, entryMap;

async function initPage() {
  const session = await validateSession();
  if (!session) return;
  token = session.token;
  user = session.user;
  userMappings = await getUserMappingsByEmail(token, user);
  try {
    toggleLoading(true);
    await updatePage();
    await sleep(500);
    toggleLoading(false);
  } catch (err) {
    console.error("Error Loading:", err);
    redirectToLogin();
  }
}
async function updatePage() {
  await loadNavbar("Plugin Use<br>Page");
  renderUserWelcome(userMappings);
  await getPlugins();
  await getUsageData();
  createPluginCards();
}
async function getPlugins() {
  activePlugins = (await getActivePlugins(token)).activePlugins;
}
async function getUsageData() {
  let data = await getPluginUse(token);
  entries = data.entries;
  entryMap = data.countMap;
  console.log(entries, entryMap);
}
function createPluginCards() {
  const container = document.getElementById("plugin-cards");
  activePlugins.forEach(async (plugin) => {
    const name = plugin.pluginName;
    const cleanName = name.replaceAll("_", " ");
    const card = document.createElement("div");
    card.classList.add("data-button");
    card.setAttribute("ID", cleanName);
    const headerTab = document.createElement("div");
    headerTab.classList.add("data-header-tab");
    const header = document.createElement("div");
    header.textContent = cleanName;
    header.classList.add("data-button-header");
    const summary = document.createElement("div");
    summary.classList.add("data-button-summary");
    let count = await getPluginCountToday(token, name);
    if (count.count != 0) summary.textContent = `+${count.count}`;
    headerTab.appendChild(header);
    headerTab.appendChild(summary);
    card.appendChild(headerTab);
    const dataTab = document.createElement("div");
    dataTab.classList.add("button-data-container");
    const image = document.createElement("img");
    image.src = `../resources/plugin_logos/${name}.png`;
    image.alt = name;
    image.classList.add("button-logo");
    const countData = document.createElement("div");
    if (entryMap[name]) countData.textContent = entryMap[name];
    else countData.textContent = "0";
    countData.classList.add("data-button-data");
    dataTab.appendChild(image);
    dataTab.appendChild(countData);
    card.appendChild(dataTab);
    container.appendChild(card);
  });
}
initPage();
