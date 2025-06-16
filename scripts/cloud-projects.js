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
  getCloudProjectsUsers,
  getModelManager,
  putModelManager,
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
let sortState = { column: "Name", direction: "asc", table: [] };

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
  // console.log(accProjects[0]);
  // console.log(bimProjects[0]);
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
  sortState.table = allProjects;
  accButton.addEventListener("click", () => {
    allButton.classList.remove("disabled");
    bimButton.classList.remove("disabled");
    accButton.classList.add("disabled");
    sortState.table = accProjects;
    populateTable(accProjects);
  });
  bimButton.addEventListener("click", () => {
    allButton.classList.remove("disabled");
    bimButton.classList.add("disabled");
    accButton.classList.remove("disabled");
    sortState.table = bimProjects;
    populateTable(bimProjects);
  });
  allButton.addEventListener("click", () => {
    allButton.classList.add("disabled");
    bimButton.classList.remove("disabled");
    accButton.classList.remove("disabled");
    sortState.table = allProjects;
    populateTable(allProjects);
  });
}
function populateTable(projects) {
  const project_table_tab = document.getElementById("project-table-tab");
  project_table_tab.innerHTML = "";
  let table_tab = document.getElementById("table-tab");
  table_tab.innerHTML = "";
  const headers = ["#", "Name", "Created At", "Members"];
  const table = document.createElement("table");
  table.id = "project-table";

  //header row
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headers.forEach((header) => {
    const data = document.createElement("th");
    data.textContent = header;
    if (header != "#") {
      data.addEventListener("click", () => {
        handleSort(data);
      });
      data.classList.add("sort-header");
    }
    headerRow.appendChild(data);
  });
  thead.appendChild(headerRow);

  //data rows
  const tbody = document.createElement("tbody");
  projects.forEach((project, index) => {
    const bodyRow = document.createElement("tr");
    const dataValues = [
      index + 1,
      project.name,
      project.createdAt.split("T")[0],
      project.memberCount,
    ];
    dataValues.forEach((value) => {
      const data = document.createElement("td");
      data.textContent = value;
      bodyRow.appendChild(data);
      bodyRow.setAttribute("data-project-id", project.id);
      bodyRow.setAttribute("data-project-name", project.name);
    });
    tbody.appendChild(bodyRow);
    bodyRow.addEventListener("click", () => selectProject(bodyRow));
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  table_tab.appendChild(table);
}
async function selectProject(row) {
  const id = row.getAttribute("data-project-id");
  const projectName = row.getAttribute("data-project-name");
  const project = sortState.table.find((project) => project.id == id);
  // console.log(project);
  const users = (await getCloudProjectsUsers(token, project.id)).users;
  splitUsers(users);
  showModelManager(projectName);
}
async function showModelManager(projectName) {
  const projectMetadata = document.getElementById("project-metadata");
  projectMetadata.innerHTML = "";
  const projectHeader = document.createElement("div");
  projectHeader.classList.add("project-metadata-header");
  // console.log(projectName);
  projectHeader.textContent = projectName;
  projectMetadata.appendChild(projectHeader);

  const managerDisplay = document.createElement("div");
  managerDisplay.id = "manager-display";
  const managerLabel = document.createElement("div");
  managerLabel.textContent = "Model Manager";
  managerLabel.id = "manager-display-label";
  const managerValue = document.createElement("div");
  const manager = await getModelManager(token, projectName);
  if (manager) {
    const managerName = manager.projectFilter.modelManagerName;
    managerValue.textContent = managerName;
  } else {
    managerValue.textContent = "NOT SET";
    // console.log("No Model Manager");
  }
  managerValue.id = "manager-display-value";
  managerDisplay.appendChild(managerLabel);
  managerDisplay.appendChild(managerValue);
  projectMetadata.appendChild(managerDisplay);
  createAddUpdateButtons(projectMetadata, manager, projectName);
}
function createAddUpdateButtons(base, manager, projectName) {
  const buttons = document.createElement("div");
  buttons.id = "manager-buttons";
  if (manager) {
  } else {
    const addButton = document.createElement("div");
    addButton.textContent = "Add";
    addButton.classList = "manager-button";
    buttons.appendChild(addButton);
    base.appendChild(buttons);
    const inputLine = document.createElement("div");
    inputLine.id = "manager-input-line";
    base.appendChild(inputLine);
    addButton.addEventListener("click", () =>
      addManager(inputLine, projectName)
    );
  }
}
function addManager(inputLine, projectName) {
  inputLine.innerHTML = "";
  const input = document.createElement("input");
  input.id = "manager-input";
  const add = document.createElement("div");
  add.textContent = "+";
  add.id = "add-manager-button";
  inputLine.appendChild(input);
  inputLine.appendChild(add);
  add.addEventListener("click", async () => {
    const managerName = input.value;
    if (managerName != "") {
      const result = await putModelManager(token, projectName, managerName);
      console.log(result);
      showModelManager(projectName);
    }
  });
  console.log("Add Manager");
}
function splitUsers(users) {
  const admin = [];
  const member = [];
  users.forEach((user) => {
    // console.log(user);
    const projectAdminProduct = user.products.find(
      (p) => p.key === "projectAdministration"
    );

    const isAdmin = projectAdminProduct?.access === "administrator";

    if (isAdmin) {
      admin.push(user);
    } else {
      member.push(user);
    }
  });
  populateUserTables(member, admin);
}
function populateUserTables(members, admins) {
  const project_table_tab = document.getElementById("project-table-tab");
  project_table_tab.innerHTML = "";
  const adminTableContainer = document.createElement("div");
  adminTableContainer.id = "admin-user-table-container";
  const adminTable = document.createElement("table");
  const adminCaption = document.createElement("caption");
  adminCaption.textContent = `Admins - ${admins.length}`;
  adminTable.id = "admin-user-table";
  adminTable.appendChild(adminCaption);
  adminTable.classList.add("user-table");
  const memberTableContainer = document.createElement("div");
  memberTableContainer.id = "member-user-table-container";
  const memberTable = document.createElement("table");
  const memberCaption = document.createElement("caption");
  memberCaption.textContent = `Members - ${members.length}`;
  memberTable.appendChild(memberCaption);
  memberTable.id = "member-user-table";
  memberTable.classList.add("user-table");
  //header row

  adminTableContainer.appendChild(createUserTable(adminTable, admins));
  memberTableContainer.appendChild(createUserTable(memberTable, members));
  project_table_tab.appendChild(adminTableContainer);
  project_table_tab.appendChild(memberTableContainer);
}
function createUserTable(userTable, users) {
  const headers = ["#", "Name", "Date Added", "Company"];
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headers.forEach((header) => {
    const data = document.createElement("th");
    data.textContent = header;
    headerRow.appendChild(data);
  });
  thead.appendChild(headerRow);
  userTable.appendChild(thead);
  //body data
  const tbody = document.createElement("tbody");
  users.forEach((user, index) => {
    // console.log(user);
    const row = document.createElement("tr");
    const values = [
      index + 1,
      user.name,
      user.addedOn.split("T")[0],
      user.companyName,
    ];
    values.forEach((value) => {
      const data = document.createElement("td");
      data.textContent = value;
      row.appendChild(data);
    });
    tbody.appendChild(row);
  });
  userTable.appendChild(tbody);
  return userTable;
}
function handleSort(header) {
  const selectedHeader = header.innerText.split(" ")[0];
  const currentSortCol = sortState.column;
  const currentSortVal = sortState.direction;
  if (currentSortCol == selectedHeader) {
    currentSortVal == "asc"
      ? (sortState.direction = "des")
      : (sortState.direction = "asc");
  } else {
    sortState.column = selectedHeader;
    sortState.direction = "asc";
  }
  document.querySelectorAll(".sort-header").forEach((th) => {
    const base = th.textContent.split(" ")[0];
    th.textContent = base;

    // Match by cleaned base text and column
    if (
      base === sortState.column ||
      (base === "Created" && sortState.column === "Created") ||
      (base === "Members" && sortState.column === "Members")
    ) {
      th.textContent += sortState.direction === "asc" ? " ▲" : " ▼";
    }
  });
  sortColumn();
}
function sortColumn() {
  const sortBy = sortState.column;
  const table = sortState.table;
  const direction = sortState.direction;
  if (sortBy == "Name") {
    if (direction == "asc") {
      table.sort((a, b) => {
        if (a.name.trim() < b.name.trim()) return -1;
        if (a.name.trim() > b.name.trim()) return 1;
        return 0;
      });
    } else {
      table.sort((a, b) => {
        if (a.name.trim() < b.name.trim()) return 1;
        if (a.name.trim() > b.name.trim()) return -1;
        return 0;
      });
    }
  } else if (sortBy == "Created") {
    if (direction == "asc") {
      table.sort(
        (a, b) =>
          new Date(a.createdAt.split("T")[0]) -
          new Date(b.createdAt.split("T")[0])
      );
    } else {
      table.sort(
        (a, b) =>
          new Date(b.createdAt.split("T")[0]) -
          new Date(a.createdAt.split("T")[0])
      );
    }
  } else {
    if (direction == "asc") {
      table.sort((a, b) => a.memberCount - b.memberCount);
    } else {
      table.sort((a, b) => b.memberCount - a.memberCount);
    }
  }
  populateTable(table);
}
initPage();
