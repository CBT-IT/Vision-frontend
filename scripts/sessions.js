import {
  getSessionsCount,
  getUserMappingsByEmail,
  getUserMappingsByAutodesk,
  getSyncsInSession,
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
  page_title.innerHTML = "Sessions<br>Page";

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
  await populateSessionsTable();
  //   await populateSessionsCard();
  //   await populateSyncsCard();
  //   await populatePluginCard();
  //   await populateUserCard();
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function populateFiltersTab() {
  const count = await getSessionsCount(token);
  const sessions_count = document.getElementById("sessions-count-data");
  sessions_count.textContent = count;
}

async function populateSessionsTable() {
  const mapObject = await getUserMappingsByAutodesk(token);
  const userMappings = mapObject.userMappings;
  const sessions = await getSessionsInfo(token);
  const sessionsArray = sessions.sessionsInfo.reverse();
  // console.log(sessionsArray);
  const table_container = document.getElementById("table-container");
  table_container.innerHTML = "";
  //header
  const sessionTable = document.createElement("table");
  sessionTable.id = "sessions-table";
  const tableHead = document.createElement("thead");
  const headers = [
    "#",
    "Date",
    "File Name",
    "Project Name",
    "User",
    "Revit Version",
    "File Size",
    "Start Time",
    "Opening Duration",
    "End Time",
    "Session Duration",
    "Crash",
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
  sessionsArray.forEach((session) => {
    const tableRow = document.createElement("tr");
    //start time
    const openingStartTime = parseStartEndTime(session.openingStartTime);
    //closing time
    let closingTime = "";
    if (session.closingTime != "") {
      closingTime = parseStartEndTime(session.closingTime);
    }
    const rowData = [
      count,
      session.date,
      session.fileName,
      session.projectName,
      userMappings[session.autodeskUserName],
      session.revitVersion,
      session.fileSize == 0 ? "" : session.fileSize,
      openingStartTime,
      parseDuration(session.openingDuration),
      closingTime,
      parseDuration(session.sessionDuration),
      session.crash ? "Yes" : "",
    ];
    rowData.forEach((data) => {
      const cell = document.createElement("td");
      cell.textContent = data;
      tableRow.appendChild(cell);
    });
    tableRow.addEventListener("click", async () => {
      tableRow.style.backgroundColor = "var(--cbt-blue)";
      const index = tableRow.childNodes[0].textContent;
      await showDetails(sessionsArray, index, tableRow);
    });
    tableBody.appendChild(tableRow);
    count++;
  });
  sessionTable.appendChild(tableHead);
  sessionTable.appendChild(tableBody);
  table_container.appendChild(sessionTable);
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

async function showDetails(sessions, index, row) {
  const session = sessions[index - 1];
  const overlay = document.getElementById("session-overlay");
  if (overlay.style.display !== "flex") {
    overlay.style.display = "flex";
  }

  populateSessionDetails(session);
  await populateSessionSyncDetails(session);

  const close_button = document.getElementById("close-button");
  close_button.addEventListener("click", () => {
    overlay.style.display = "none";
    row.style.backgroundColor = "white";
  });
}

function populateSessionDetails(session) {
  const overlay_session_contents = document.getElementById(
    "overlay-session-contents"
  );
  const table = document.createElement("table");
  table.id = "session-detail-table";
  const caption = document.createElement("caption");
  caption.classList.add("details-caption");
  caption.textContent = "Session Details";
  table.appendChild(caption);
  const column1 = [
    "date",
    "openingStartTime",
    "openingEndTime",
    "openingDuration",
    "autodeskUserName",
    "deviceUserName",
    "deviceName",
    "networkInfo",
    "userIP",
    "source",
    "projectName",
    "fileName",
    "filePath",
    "fileSize",
    "localFile",
    "deviceFreeSpace",
    "revitVersion",
    "cbtToolsVersion",
    "uniqueId",
    "closingTime",
    "sessionDuration",
    "crash",
  ];

  const column2 = column1.map((key) => session[key]);

  // Optional: populate the overlay with labels and values
  overlay_session_contents.innerHTML = ""; // clear previous content
  for (let i = 0; i < column1.length; i++) {
    const row = document.createElement("tr");
    const data1 = document.createElement("td");
    data1.textContent = column1[i];
    const data2 = document.createElement("td");
    data2.textContent = column2[i];
    row.appendChild(data1);
    row.appendChild(data2);
    table.appendChild(row);
  }
  overlay_session_contents.appendChild(table);
}

async function populateSessionSyncDetails(session) {
  const overlay_syncs_content = document.getElementById(
    "overlay-syncs-contents"
  );
  overlay_syncs_content.innerHTML = "";
  const syncInSession = await getSyncsInSession(token, session._id);
  const syncs = syncInSession.syncs;
  console.log(syncs);
  const syncsTable = document.createElement("table");
  syncsTable.id = "syncs-in-session-table";
  const caption = document.createElement("caption");
  caption.classList.add("details-caption");
  caption.textContent = `Syncs in Session - ${syncs.length}`;
  syncsTable.appendChild(caption);

  const headers = ["#", "Time", "Gap", "Duration"];
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headers.forEach((header) => {
    const headerData = document.createElement("th");
    headerData.textContent = header;
    headerRow.appendChild(headerData);
  });
  thead.appendChild(headerRow);
  syncsTable.appendChild(headerRow);

  let count = 1;
  syncs.forEach((sync) => {
    const row = document.createElement("tr");
    const dataValues = [
      count,
      parseStartEndTime(sync.syncStartTime),
      parseDuration(sync.gap),
      parseDuration(sync.totalDuration),
    ];
    dataValues.forEach((value) => {
      const data = document.createElement("td");
      data.textContent = value;
      row.appendChild(data);
    });
    count++;
    syncsTable.appendChild(row);
  });
  overlay_syncs_content.appendChild(syncsTable);
}
initHomepage();
