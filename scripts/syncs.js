import {
  getUserMappingsByEmail,
  getUserMappingsByAutodesk,
  getSyncInfo,
  getSyncInfoCount,
} from "../utility/backendCalls.js";
import { validateSession, redirectToLogin } from "../utility/auth.js";
import {
  sleep,
  loadNavbar,
  toggleLoading,
  renderUserWelcome,
  createTable,
  parseStartEndTime,
  parseDuration,
  parseDate,
} from "../utility/utils.js";

let token, user, userMappings;

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
  await loadNavbar("Syncs<br>Page");
  renderUserWelcome(userMappings);
  await populateFiltersTab();
  await populateSyncsTable();
}

async function populateFiltersTab() {
  const count = await getSyncInfoCount(token);
  const syncs_count = document.getElementById("syncs-count-data");
  syncs_count.textContent = count;
}

async function populateSyncsTable() {
  const mapObject = await getUserMappingsByAutodesk(token);
  const userMappings = mapObject.userMappings;
  const syncs = await getSyncInfo(token);
  const syncsArray = syncs.syncInfo.reverse();
  // console.log(syncsArray);
  const table_container = document.getElementById("table-container");
  table_container.innerHTML = "";
  const headers = [
    "#",
    "Date",
    "File Name",
    "File Path",
    "User",
    "Start Time",
    "Gap",
    "Duration",
  ];
  const rows = syncsArray.map((sync, i) => [
    i + 1,
    parseDate(sync.date),
    sync.fileName,
    sync.filePath,
    userMappings[sync.autodeskUserName],
    parseStartEndTime(sync.syncStartTime),
    parseDuration(sync.gap),
    parseDuration(sync.totalDuration),
  ]);
  const syncsTable = createTable(headers, rows);
  table_container.appendChild(syncsTable);
}

initPage();
