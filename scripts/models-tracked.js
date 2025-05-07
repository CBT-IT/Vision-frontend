import {
  getSessionsCount,
  getUserMappingsByEmail,
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
    tbody.appendChild(row);
    count++;
  }
  table.appendChild(tbody);

  modelsTableContainer.appendChild(table);
}
