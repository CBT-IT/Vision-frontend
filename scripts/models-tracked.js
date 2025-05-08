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
  getActiveUsersCount,
  getActivityChartData,
  getCloudProjectsCount,
  getModelsTrackedCount,
  getModelsTracked,
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
  page_title.innerHTML = "Models Tracked <br>Page";

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

  await populateModelsTrackedTable();
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

initHomepage();

async function populateModelsTrackedTable() {
  const modelsTableContainer = document.getElementById(
    "models-table-container"
  );
  modelsTableContainer.innerHTML = "";
  const table = document.createElement("table");
  table.id = "models-tracked-table";
  const thead = document.createElement("thead");
  const headers = [
    "#",
    "File Name",
    "Project Name",
    "File Size",
    "Users",
    "Last Open",
    "Entry Count",
  ];
  const headerRow = document.createElement("tr");
  headers.forEach((header) => {
    const data = document.createElement("th");
    data.textContent = header;
    headerRow.appendChild(data);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  let count = 1;
  const modelsData = await getModelsTracked(token);
  modelsData.models.sort((a, b) => b.size - a.size);
  for (const model of modelsData.models) {
    const dataValues = [
      count,
      model.entries[0].fileName,
      model.entries[0].projectName,
      model.size,
      Object.keys(model.userCounts).length,
      model.entries[0].date,
      model.entries.length,
    ];
    const row = document.createElement("tr");
    dataValues.forEach((value) => {
      const data = document.createElement("td");
      data.textContent = value;
      row.appendChild(data);
    });
    row.addEventListener("click", () => {
      const placeholder = document.getElementById("placeholder");
      placeholder.style.display = "none";
      const loading = document.getElementById("loading");
      loading.style.display = "flex";
      const selected_model_table_container = document.getElementById(
        "selected-model-table-container"
      );
      selected_model_table_container.innerHTML = "";
      modelSelected(row, modelsData);
      loading.style.display = "none";
    });
    tbody.appendChild(row);
    count++;
  }
  table.appendChild(tbody);

  modelsTableContainer.appendChild(table);
}

async function modelSelected(row, models) {
  const data = row.children;
  const modelIndex = data[0].textContent - 1;
  const selectedModel = models.models[modelIndex];
  const userMappings = await getUserMappingsByAutodesk(token);
  // console.log(selectedModel);
  const entries = selectedModel.entries;
  const users = Object.keys(selectedModel.userCounts);
  const userCounts = selectedModel.userCounts;
  const lastUserEntry = {};
  users.forEach((user) => {
    const userEntry = entries.filter((entry) => entry.autodeskUserName == user);
    lastUserEntry[user] = userEntry[0].date;
  });
  // console.log(userMappings);
  // console.log("Last User Entry: ");
  // console.log(lastUserEntry);
  // console.log("Users: ");
  // console.log(users);
  // console.log("Entries: ");
  // console.log(entries);
  await populateSelectedModelTable(
    users,
    lastUserEntry,
    entries,
    userCounts,
    userMappings.userMappings
  );
  await populateModelSessionsTable(entries, userMappings.userMappings);
  const selectedModelData = document.getElementById("selected-model-data");
  selectedModelData.style.display = "flex";
}

async function populateSelectedModelTable(
  users,
  lastUserEntry,
  entries,
  userCounts,
  userMappings
) {
  const selected_model_table_container = document.getElementById(
    "selected-model-table-container"
  );
  const modelTable = document.createElement("div");
  modelTable.id = "model-table";
  const table = document.createElement("table");
  table.id = "selected-model-table";
  const caption = document.getElementById("table-container-header");
  caption.textContent = `File: ${entries[0].fileName}`;
  //headers
  const headers = ["#", "User", "Sessions", "Last Accessed"];
  const headerRow = document.createElement("thead");
  headers.forEach((header) => {
    const headerData = document.createElement("th");
    headerData.textContent = header;
    headerRow.appendChild(headerData);
  });
  table.appendChild(headerRow);
  //body
  const body = document.createElement("tbody");
  let count = 1;
  users.forEach((user) => {
    const dataValues = [
      count,
      userMappings[user],
      userCounts[user],
      lastUserEntry[user],
    ];
    const row = document.createElement("tr");
    dataValues.forEach((dataValue) => {
      const data = document.createElement("td");
      data.textContent = dataValue;
      row.appendChild(data);
    });
    body.appendChild(row);
    count++;
  });
  table.appendChild(body);

  modelTable.appendChild(table);
  selected_model_table_container.appendChild(modelTable);
}

async function populateModelSessionsTable(entries, userMappings) {
  console.log(entries);
  const selected_model_table_container = document.getElementById(
    "selected-model-table-container"
  );
  const sessionTable = document.createElement("div");
  sessionTable.id = "session-table";
  const table = document.createElement("table");
  table.id = "model-session-table";
  const headers = ["#", "Date", "Time", "Duration", "Syncs", "User"];
  const headerRow = document.createElement("thead");
  headers.forEach((header) => {
    const data = document.createElement("th");
    data.textContent = header;
    headerRow.appendChild(data);
  });
  table.appendChild(headerRow);

  const body = document.createElement("tbody");
  let count = 1;
  for (const entry of entries) {
    console.log(entry);
    const duration = parseDuration(entry.sessionDuration);
    const endTime = parseStartEndTime(entry.openingStartTime);
    const syncsInSession = await getSyncsInSession(token, entry._id);
    const dataValues = [
      count,
      entry.date,
      endTime,
      duration == "" ? "Crash" : duration,
      syncsInSession.syncs.length,
      userMappings[entry.autodeskUserName],
    ];
    const row = document.createElement("tr");
    dataValues.forEach((dataValue) => {
      const data = document.createElement("td");
      data.textContent = dataValue;
      row.appendChild(data);
    });
    count++;
    body.appendChild(row);
  }
  table.appendChild(body);
  sessionTable.appendChild(table);
  selected_model_table_container.appendChild(sessionTable);
}

function parseStartEndTime(time) {
  const [, timePart, period] = time.split(" ");
  const [hr, min] = timePart.split(":");
  const cleanTime = `${hr}:${min} ${period}`;
  return cleanTime;
}
function parseDuration(duration) {
  const cleanDuration = duration.split(".")[0];
  return cleanDuration;
}
