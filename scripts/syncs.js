import {
  getSessionsCount,
  getUserMappingsByEmail,
  getUserMappingsByAutodesk,
  getSessionsInfoToday,
  getSyncInfoToday,
  getPluginUseCount,
  getPluginUseToday,
  getUserCount,
  getSessionsInfo,
  getSyncInfo,
  getSyncInfoCount,
  getPluginUse,
  getViewBookmarks,
} from "../utility/backendCalls.js";

const token = sessionStorage.getItem("idToken");
if (!token) {
  sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
  window.location.href = "../index.html";
}
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

    await updatePage();
    await sleep(500);
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

  await import("../scripts/navbar.js");

  const page_title = document.getElementById("page-title");
  page_title.innerHTML = "Syncs<br>Page";

  const back_button = document.getElementById("back-button");
  back_button.disabled = false;
  back_button.addEventListener("click", () => {
    window.location.href = "/pages/home.html";
  });

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

  await populateFiltersTab();
  await populateSyncsTable();
  //   await populateSessionsCard();
  //   await populateSyncsCard();
  //   await populatePluginCard();
  //   await populateUserCard();
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
  console.log(syncsArray);
  const table_container = document.getElementById("table-container");
  table_container.innerHTML = "";
  //header
  const syncsTable = document.createElement("table");
  const tableHead = document.createElement("thead");
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
  const headerRow = document.createElement("tr");
  headers.forEach((header) => {
    const headerData = document.createElement("th");
    headerData.textContent = header;
    headerRow.appendChild(headerData);
  });
  tableHead.appendChild(headerRow);
  //body
  const tableBody = document.createElement("tbody");
  let count = 1;
  for (const sync of syncsArray) {
    try {
      const tableRow = document.createElement("tr");
      //start time
      const syncStartTime = parseStartEndTime(sync.syncStartTime);
      const rowData = [
        count,
        parseDate(sync.date),
        sync.fileName,
        sync.filePath,
        userMappings[sync.autodeskUserName],
        syncStartTime,
        parseDuration(sync.gap),
        parseDuration(sync.totalDuration),
      ];
      rowData.forEach((data) => {
        const cell = document.createElement("td");
        cell.textContent = data;
        tableRow.appendChild(cell);
      });
      tableBody.appendChild(tableRow);
      count++;
    } catch {
      continue;
    }
  }
  syncsTable.appendChild(tableHead);
  syncsTable.appendChild(tableBody);
  table_container.appendChild(syncsTable);
}

function parseDate(date) {
  const [datePart, ,] = date.split(" ");
  return datePart;
}

function parseDuration(duration) {
  const cleanDuration = duration.split(".")[0];
  return cleanDuration;
}

function parseStartEndTime(time) {
  const [, timePart, period] = time.split(" ");
  const [hr, min] = timePart.split(":");
  const cleanTime = `${hr}:${min} ${period}`;
  return cleanTime;
}

initHomepage();
