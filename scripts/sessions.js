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
if (!token) {
  sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
  window.location.href = "../index.html";
}
const user = sessionStorage.getItem("userEmail");
const loading_screen = document.getElementById("loading-message");
const main_container = document.getElementById("main-container");
const mapObject = await getUserMappingsByAutodesk(token);
let userMappings = mapObject.userMappings;

let sessions, sessionCount;
await getSessions();
async function getSessions() {
  let sessionResponse = await getSessionsInfo(token);
  sessions = sessionResponse.sessionsInfo.reverse();
  sessionCount = await getSessionsCount(token);
}

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
    getSessions();
    clearRadios();
    initHomepage();
  });

  updateSessionCount(sessionCount);
  populateSessionsTable(sessions);
  updateCalenderFilter();

  const filter_dropdown_container = document.getElementById(
    "filter-dropdown-container"
  );
  filter_dropdown_container.classList.add("disabled");
  clearDropdown();
  const filters_form = document.getElementById("filters-form");
  filters_form.addEventListener("change", (event) => {
    if (event.target.name === "filter") {
      const checkedValue = event.target.value;
      if (checkedValue == "clear") {
        clearFilters(filter_dropdown_container);
        clearRadios();
        clearDropdown();
        clearCalenderFilter();
        updateSessionCount(sessionCount);
        populateSessionsTable(sessions);
      } else {
        clearCalenderFilter();
        filter_dropdown_container.classList.remove("disabled");
        if (checkedValue == "user") {
          populateUserFilters();
        } else if (checkedValue == "fileName") {
          populateFileFilters();
        } else if (checkedValue == "project") {
          populateProjectFilters();
        } else if (checkedValue == "version") {
          populateVersionFilters();
        } else if (checkedValue == "crash") {
          filter_dropdown_container.classList.add("disabled");
          populateCrashFilters();
        }
      }
    }
  });
  const dropdownTitle = document.querySelector(
    "#filter-dropdown .dropdown-title"
  );
  const optionsContainer = document.querySelector("#filter-dropdown .options");

  dropdownTitle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isVisible = optionsContainer.style.display === "flex";
    optionsContainer.style.display = isVisible ? "none" : "flex";
  });

  // Close dropdown if clicked outside
  document.addEventListener("click", () => {
    optionsContainer.style.display = "none";
  });

  optionsContainer.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}
function updateCalenderFilter() {
  const startInput = document.getElementById("startDate");
  const endInput = document.getElementById("endDate");
  const applyCalender = document.getElementById("apply-calender-filter");
  const clearCalender = document.getElementById("clear-calender-filter");
  applyCalender.classList.add("disabled");
  clearCalender.classList.add("disabled");
  endInput.classList.add("disabled");
  const baseDate = "2025-04-03";
  const today = new Date().toISOString().split("T")[0];
  startInput.min = baseDate;
  startInput.max = today;
  startInput.addEventListener("change", () => {
    if (startInput.value) {
      endInput.classList.remove("disabled");
    }
    endInput.min = startInput.value || baseDate;
    endInput.max = today;
  });
  endInput.addEventListener("change", () => {
    if (endInput.value) {
      applyCalender.classList.remove("disabled");
    }
  });
  applyCalender.addEventListener("click", () => {
    clearCalender.classList.remove("disabled");
    filterByCalender(startInput.value, endInput.value);
  });
  clearCalender.addEventListener("click", clearCalenderFilter);
}
function filterByCalender(startDate, endDate) {
  const calenderSessions = sessions.filter(
    (session) => session.date >= startDate && session.date <= endDate
  );
  populateSessionsTable(calenderSessions);
  updateSessionCount(calenderSessions.length);
}
function clearCalenderFilter() {
  const startInput = document.getElementById("startDate");
  const endInput = document.getElementById("endDate");
  const applyCalender = document.getElementById("apply-calender-filter");
  const clearCalender = document.getElementById("clear-calender-filter");
  startInput.value = "";
  endInput.value = "";
  endInput.classList.add("disabled");
  applyCalender.classList.add("disabled");
  clearCalender.classList.add("disabled");
  populateSessionsTable(sessions);
  updateSessionCount(sessions.length);
}
function populateUserFilters() {
  const users = [
    ...new Set(
      sessions
        .map((session) => userMappings[session.autodeskUserName])
        .filter(Boolean)
    ),
  ];

  const dropdown = document.getElementById("filter-dropdown");
  const optionsContainer = dropdown.querySelector(".options");
  const input = dropdown.querySelector(".dropdown-title");

  // Clear previous
  optionsContainer.innerHTML = "";
  input.value = "";

  users.forEach((user) => {
    const count = getUsersCount(user);
    const option = document.createElement("div");
    option.classList.add("option");
    option.textContent = `${count} -- ${user}`;

    option.addEventListener("click", () => {
      input.value = user;
      optionsContainer.style.display = "none";
      filterTable_User(user);
    });

    optionsContainer.appendChild(option);
  });
}
function getUsersCount(user) {
  return sessions.reduce(
    (count, session) =>
      count + (userMappings[session.autodeskUserName] === user ? 1 : 0),
    0
  );
}
function populateFileFilters() {
  const files = [
    ...new Set(sessions.map((session) => session.fileName).filter(Boolean)),
  ];

  const dropdown = document.getElementById("filter-dropdown");
  const optionsContainer = dropdown.querySelector(".options");
  const input = dropdown.querySelector(".dropdown-title");

  // Clear previous
  optionsContainer.innerHTML = "";
  input.value = "";

  files.forEach((file) => {
    const count = getFileCount(file);
    const option = document.createElement("div");
    option.classList.add("option");
    option.textContent = `${count} -- ${file}`;

    option.addEventListener("click", () => {
      input.value = file;
      optionsContainer.style.display = "none";
      filterTable_File(file);
    });

    optionsContainer.appendChild(option);
  });
}
function getFileCount(file) {
  return sessions.reduce(
    (count, session) => count + (session.fileName === file ? 1 : 0),
    0
  );
}
function populateProjectFilters() {
  const projects = [
    ...new Set(sessions.map((session) => session.projectName).filter(Boolean)),
  ];

  const dropdown = document.getElementById("filter-dropdown");
  const optionsContainer = dropdown.querySelector(".options");
  const input = dropdown.querySelector(".dropdown-title");

  // Clear previous
  optionsContainer.innerHTML = "";
  input.value = "";

  projects.forEach((project) => {
    const count = getProjectCount(project);
    const option = document.createElement("div");
    option.classList.add("option");
    option.textContent = `${count} -- ${project}`;

    option.addEventListener("click", () => {
      input.value = project;
      optionsContainer.style.display = "none";
      filterTable_Project(project);
    });

    optionsContainer.appendChild(option);
  });
}
function getProjectCount(project) {
  return sessions.reduce(
    (count, session) => count + (session.projectName === project ? 1 : 0),
    0
  );
}
function populateVersionFilters() {
  const versions = [
    ...new Set(sessions.map((session) => session.revitVersion).filter(Boolean)),
  ];

  const dropdown = document.getElementById("filter-dropdown");
  const optionsContainer = dropdown.querySelector(".options");
  const input = dropdown.querySelector(".dropdown-title");

  // Clear previous
  optionsContainer.innerHTML = "";
  input.value = "";

  versions.forEach((version) => {
    const count = getVersionCount(version);
    const option = document.createElement("div");
    option.classList.add("option");
    option.textContent = `${count} -- ${version}`;

    option.addEventListener("click", () => {
      input.value = version;
      optionsContainer.style.display = "none";
      filterTable_Version(version);
    });

    optionsContainer.appendChild(option);
  });
}
function getVersionCount(version) {
  return sessions.reduce(
    (count, session) => count + (session.revitVersion === version ? 1 : 0),
    0
  );
}
function populateCrashFilters() {
  const filtered = sessions.filter((session) => session.crash);
  populateSessionsTable(filtered);
  updateSessionCount(filtered.length);
}
function filterTable_User(user) {
  const filtered = sessions.filter(
    (session) => userMappings[session.autodeskUserName] === user
  );
  populateSessionsTable(filtered);
  updateSessionCount(filtered.length);
}
function filterTable_File(file) {
  const filtered = sessions.filter((session) => session.fileName === file);
  populateSessionsTable(filtered);
  updateSessionCount(filtered.length);
}
function filterTable_Project(project) {
  const filtered = sessions.filter(
    (session) => session.projectName === project
  );
  populateSessionsTable(filtered);
  updateSessionCount(filtered.length);
}
function filterTable_Version(version) {
  const filtered = sessions.filter(
    (session) => session.revitVersion === version
  );
  populateSessionsTable(filtered);
  updateSessionCount(filtered.length);
}
function clearRadios() {
  const radios = document.querySelectorAll('input[name="filter"]');
  radios.forEach((radio) => (radio.checked = false));
}
function clearFilters(filterContainer) {
  filterContainer.classList.add("disabled");
}
function clearDropdown() {
  const input = document.querySelector("#filter-dropdown .dropdown-title");
  const optionsContainer = document.querySelector("#filter-dropdown .options");

  input.value = "";
  optionsContainer.innerHTML = "";
  optionsContainer.style.display = "none";
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function updateSessionCount(count) {
  const sessions_count = document.getElementById("sessions-count-data");
  sessions_count.textContent = count;
}
function populateSessionsTable(dataList) {
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
  dataList.forEach((session) => {
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
      await showDetails(sessions, index, tableRow);
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
