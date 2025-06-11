import {
  getSessionsCount,
  getUserMappingsByEmail,
  getUsers,
  getLastUserEntry,
  getUserMappingsByAutodesk,
  getUserInfoByYear,
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
  getActiveUsers,
  getUserImage,
} from "../utility/backendCalls.js";

const userPicturesPath =
  "S:\\CAD-BIM-Library\\Comp-Design\\CBT Plugins\\CBT_Vision_Assets\\user_pictures";
const token = sessionStorage.getItem("idToken");
const userMappings = await getUserMappingsByAutodesk(token);
let allEntries;
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

  await populateUsers();
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function populateUsers() {
  const user_header = document.getElementById("user-header");
  const versions = ["2022", "2024", "2025"];
  versions.forEach((version, index) => {
    const version_button = document.createElement("div");
    version_button.classList.add("version-button");
    version_button.textContent = version;
    if (index == 0) {
      version_button.classList.add("disabled");
    }
    user_header.appendChild(version_button);
    version_button.addEventListener("click", () =>
      handleVersionClick(version_button)
    );
  });
  const count_button = document.createElement("div");
  count_button.textContent = "User Count";
  count_button.id = "user-year-count";
  count_button.classList.add("version-button");
  user_header.appendChild(count_button);

  updateTable(versions[0]);
}
function handleVersionClick(button) {
  const selectedYear = button.innerText;
  const user_header = document.getElementById("user-header");
  const versions = user_header.childNodes;
  versions.forEach((version) => {
    if (version.innerText == selectedYear) {
      version.classList.add("disabled");
    } else {
      version.classList.remove("disabled");
    }
  });
  updateTable(selectedYear);
}
async function updateTable(selectedYear) {
  const userMappings = (await getUserMappingsByAutodesk(token)).userMappings;
  const userList = await getUserInfoByYear(token, selectedYear);
  const user_year_count = document.getElementById("user-year-count");
  user_year_count.textContent = `User Count - ${userList.count}`;
  console.log(userList);

  const user_list = document.getElementById("user-list");
  user_list.innerHTML = "";
  //Table
  const table = document.createElement("table");
  table.id = "user-table";

  //header
  const headers = ["#", "Name", "Device", "CBT Version"];
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headers.forEach((header) => {
    const data = document.createElement("th");
    data.textContent = header;
    headerRow.appendChild(data);
  });
  thead.appendChild(headerRow);

  //body
  const tbody = document.createElement("tbody");
  const users = userList.users;
  users.forEach((user, index) => {
    const row = document.createElement("tr");
    const dataValues = [
      index + 1,
      userMappings[user.autodeskUserName],
      user.latestEntry.deviceName,
      user.latestEntry.cbtToolsVersion,
    ];
    dataValues.forEach((value) => {
      const data = document.createElement("td");
      data.textContent = value;
      row.appendChild(data);
    });
    tbody.appendChild(row);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  user_list.appendChild(table);
}
initPage();
