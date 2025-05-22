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
  getActiveUsers,
} from "../utility/backendCalls.js";

const token = sessionStorage.getItem("idToken");
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
  page_title.innerHTML = "Active Users<br>Page";

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

  await populateActiveUsersData();
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function populateActiveUsersData() {
  allEntries = (await getActiveUsers(token)).activeUsers;
  const userMappings = (await getUserMappingsByAutodesk(token)).userMappings;
  //   console.log(userMappings);
  const activeUsers = new Set(
    allEntries.map((user) => userMappings[user.autodeskUserName])
  );
  populateUserList(userMappings);
  //   console.log(activeUsers);
}
function populateUserList(userMappings) {
  //   console.log(allEntries);
  const activeUsers = new Set(
    allEntries.map((entry) => entry.autodeskUserName)
  );
  //   console.log(activeUsers);
  const user_list = document.getElementById("user-list");
  user_list.innerHTML = "";
  const userTableTitle = document.createElement("div");
  userTableTitle.id = "user-table-title";
  userTableTitle.classList.add("data-title");
  userTableTitle.textContent = `Active Users - ${activeUsers.size}`;
  user_list.appendChild(userTableTitle);
  const divider1 = document.createElement("div");
  divider1.classList.add("divider");
  user_list.appendChild(divider1);
  const tableContainer = document.createElement("div");
  tableContainer.id = "table-container";
  const userTable = document.createElement("table");
  const headers = ["User", "Active Sessions"];
  const tableHeader = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headers.forEach((header) => {
    const headerData = document.createElement("th");
    headerData.textContent = header;
    headerRow.appendChild(headerData);
  });
  tableHeader.appendChild(headerRow);
  userTable.appendChild(tableHeader);
  const tableBody = document.createElement("tbody");
  //   console.log(activeUsers);
  activeUsers.forEach((user) => {
    const userValues = [userMappings[user], getUserSessionCount(user)];
    // console.log(userValues);

    const bodyRow = document.createElement("tr");
    for (const userValue of userValues) {
      const data = document.createElement("td");
      data.textContent = userValue;
      bodyRow.appendChild(data);
    }
    bodyRow.addEventListener("click", () =>
      showUserSessions(bodyRow, userMappings)
    );
    tableBody.appendChild(bodyRow);
  });
  userTable.appendChild(tableBody);
  tableContainer.appendChild(userTable);
  user_list.appendChild(tableContainer);
  const divider2 = document.createElement("div");
  divider2.classList.add("divider");
  user_list.appendChild(divider2);
}
function getUserSessions(autodeskName) {
  const userEntry = allEntries.filter(
    (entry) => entry.autodeskUserName == autodeskName && !entry.crash
  );
  return userEntry;
}
function getUserSessionCount(autodeskName) {
  const userEntry = allEntries.filter(
    (entry) => entry.autodeskUserName == autodeskName && !entry.crash
  );
  //   console.log(userEntry);
  return userEntry.length;
}
function showUserSessions(userRow, userMappings) {
  //   console.log("Clicked");
  const user = userRow.childNodes[0].textContent;
  const autodeskName = Object.keys(userMappings).find(
    (key) => userMappings[key] === user
  );
  const sessions = getUserSessions(autodeskName);
  const fileNames = sessions.map((session) => session.fileName);

  console.log(fileNames);
  //   console.log(user.textContent);
  const models_list = document.getElementById("models-list");
  models_list.innerHTML = "";
  models_list.style.display = "flex";
  const name = document.createElement("div");
  name.classList.add("data-title");
  name.textContent = user;
  const files = document.createElement("div");
  fileNames.forEach((file) => {
    const fileEntry = document.createElement("div");
    fileEntry.textContent = file;
    fileEntry.id = "model-file";
    files.appendChild(fileEntry);
  });
  models_list.appendChild(name);
  const divider = document.createElement("div");
  divider.classList.add("divider");
  models_list.appendChild(divider);
  models_list.appendChild(files);
}
initPage();
