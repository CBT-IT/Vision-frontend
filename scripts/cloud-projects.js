import {
  getSessionsCount,
  getUserMappingsByEmail,
  getUsers,
  getLastUserEntry,
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
  getCloudProjects,
  getModelsTrackedCount,
  getModelsTracked,
  getSessionsInfo,
  getSyncInfo,
  getSyncInfoCount,
  getPluginUse,
  getViewBookmarks,
  getActiveUsers,
} from "../utility/backendCalls.js";

const token = sessionStorage.getItem("idToken");
let allProjects, bimProjects, accProjects;
if (!token) {
  sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
  window.location.href = "../index.html";
}
const user = sessionStorage.getItem("userEmail");
const loading_screen = document.getElementById("loading-message");
const main_container = document.getElementById("main-container");

async function initPage() {
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
  page_title.innerHTML = "Users<br>Page";

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
    initPage();
  });

  await getProjects();
  populateProjects();
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function getProjects() {
  allProjects = (await getCloudProjects(token)).projects;
  bimProjects = allProjects.filter((x) => x.platform == "bim360");
  accProjects = allProjects.filter((x) => x.platform == "acc");
  console.log(accProjects[0]);
  console.log(bimProjects[0]);
}
function populateProjects() {
  const all_data = document.getElementById("all-projects-data");
  const bim_data = document.getElementById("bim-projects-data");
  const acc_data = document.getElementById("acc-projects-data");
  all_data.textContent = allProjects.length;
  bim_data.textContent = bimProjects.length;
  acc_data.textContent = accProjects.length;
  const allButton = document.getElementById("all-projects-button");
  const accButton = document.getElementById("acc-projects-button");
  const bimButton = document.getElementById("bim-projects-button");
  bimButton.classList.remove("disabled");
  accButton.classList.remove("disabled");
  allButton.classList.add("disabled");
  populateTable(allProjects);
  accButton.addEventListener("click", () => {
    allButton.classList.remove("disabled");
    bimButton.classList.remove("disabled");
    accButton.classList.add("disabled");
    populateTable(accProjects);
  });
  bimButton.addEventListener("click", () => {
    allButton.classList.remove("disabled");
    bimButton.classList.add("disabled");
    accButton.classList.remove("disabled");
    populateTable(bimProjects);
  });
  allButton.addEventListener("click", () => {
    allButton.classList.add("disabled");
    bimButton.classList.remove("disabled");
    accButton.classList.remove("disabled");
    populateTable(allProjects);
  });
}
function populateTable(projects) {
  let table_tab = document.getElementById("table-tab");
  table_tab.innerHTML = "";
  const headers = ["#", "Name", "Created At", "Members"];
  let html = "<table>";

  //header row
  html += "<thead><tr>";
  html += headers.map((header) => `<th>${header}</th>`).join("");
  html += "</tr></thead>";

  //data rows
  html += "<tbody>";
  html += projects
    .map((project, index) => {
      return `<tr>
        <td>${index + 1}</td>
        <td>${project.name}</td>
        <td>${project.createdAt.split("T")[0]}</td>
        <td>${project.memberCount}</td>
        </tr>`;
    })
    .join("");

  table_tab.innerHTML = html;
}
initPage();
