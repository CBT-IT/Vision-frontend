import {
  getUserMappingsByEmail,
  getUserMappingsByAutodesk,
  getUserInfoByYear,
  getUserImage,
  getProjectsByUser,
} from "../utility/backendCalls.js";
import { validateSession, redirectToLogin } from "../utility/auth.js";
import {
  sleep,
  loadNavbar,
  toggleLoading,
  renderUserWelcome,
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
  await loadNavbar("Users<br>Page");
  renderUserWelcome(userMappings);
  await populateUsers();
}
async function populateUsers() {
  const user_header = document.getElementById("user-header");
  user_header.innerHTML = "";
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
  const user_data = document.getElementById("user-data");
  user_data.innerHTML = "";
  updateTable(selectedYear);
}
async function updateTable(selectedYear) {
  const user_data = document.getElementById("user-data");
  user_data.innerHTML = "";
  const userList = await getUserInfoByYear(token, selectedYear);
  const userMap = (await getUserMappingsByAutodesk(token)).userMappings;
  console.log(userMap);
  const user_year_count = document.getElementById("user-year-count");
  user_year_count.textContent = `User Count - ${userList.count}`;
  // console.log(userList);

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
      userMap[user.autodeskUserName],
      user.latestEntry.deviceName,
      user.latestEntry.cbtToolsVersion,
    ];
    dataValues.forEach((value) => {
      const data = document.createElement("td");
      data.textContent = value;
      row.appendChild(data);
    });
    row.addEventListener("click", () => handleUserRowClick(user));
    tbody.appendChild(row);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  user_list.appendChild(table);
}
async function handleUserRowClick(user) {
  const userMap = (await getUserMappingsByAutodesk(token)).userMappings;
  const entry = user.latestEntry;

  const user_data = document.getElementById("user-data");
  user_data.innerHTML = "";

  const user_profile = document.createElement("div");
  user_profile.id = "user-profile";

  const profile_data = document.createElement("div");
  profile_data.id = "profile-data";

  //table
  const userImage = document.createElement("img");
  userImage.id = "user-image";
  const userName = userMap[user.autodeskUserName];
  const imageLocation = getUserImage(userName.toLowerCase());
  userImage.setAttribute("src", imageLocation);
  userImage.onerror = () => {
    userImage.src = getUserImage("placeholder");
  };
  userImage.classList.add("user-image");
  const data_table = document.createElement("table");
  data_table.id = "user-metadata";
  const dataValues = [
    ["Name", userName],
    ["AutodeskId", user.autodeskUserName],
    ["Drive Space", entry.deviceFreeSpace],
    ["Last Entry", entry.date],
  ];
  const tbody = document.createElement("tbody");
  dataValues.forEach((value) => {
    const row = document.createElement("tr");
    const data1 = document.createElement("td");
    data1.textContent = value[0];
    data1.classList = "value-label";
    const data2 = document.createElement("td");
    data2.textContent = value[1];
    data2.classList = "value-data";
    row.appendChild(data1);
    row.appendChild(data2);

    tbody.appendChild(row);
  });
  data_table.appendChild(tbody);
  profile_data.appendChild(data_table);
  profile_data.appendChild(userImage);
  user_profile.appendChild(profile_data);
  const projectsData = await populateProjects(user);
  user_profile.appendChild(projectsData);
  user_data.appendChild(user_profile);
}
async function populateProjects(user) {
  const userProjects = await getProjectsByUser(token, user.autodeskUserName);
  // console.log(userProjects);
  const projectsList = document.createElement("div");
  projectsList.id = "project-file-list";
  const projectHeader = document.createElement("div");
  projectHeader.id = "project-list-header";
  projectHeader.textContent = `Projects Accessed - ${userProjects.projectCount}`;
  projectsList.appendChild(projectHeader);
  const projectListContainer = document.createElement("div");
  projectListContainer.id = "prject-list-container";
  const projects = userProjects.projects;
  projects.forEach((project) => {
    const data = document.createElement("div");
    data.textContent = `${project.projectName} -- ${project.files.length}`;
    data.classList.add("project-entry");
    projectListContainer.appendChild(data);
    const files = project.files;
    files.forEach((file) => {
      const fileData = document.createElement("div");
      fileData.textContent = file;
      fileData.classList.add("file-entry");
      projectListContainer.appendChild(fileData);
    });
  });
  projectsList.appendChild(projectListContainer);
  return projectsList;
}
initPage();
