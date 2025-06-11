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
  const users = (await getUsers(token)).users;
  const userCount = document.getElementById("user-header");
  userCount.textContent = `Users - ${users.length}`;
  let userMap = userMappings.userMappings;
  const userList = document.getElementById("user-list");
  // console.log(users);
  users.forEach((user) => {
    const userCard = document.createElement("div");
    userCard.classList.add("user-card");
    const userImage = document.createElement("img");
    userImage.classList.add("user-image");
    const userName = userMap[user];
    // console.log(userName);
    const userImageLocation = getUserImage(userName.toLowerCase());
    userImage.src = userImageLocation;
    userImage.onerror = () => {
      userImage.src = getUserImage("placeholder");
    };
    // console.log(userImage);
    const nameLabel = document.createElement("div");
    nameLabel.classList.add("user-name-label");
    nameLabel.textContent = userName;
    userCard.appendChild(userImage);
    userCard.appendChild(nameLabel);
    userList.appendChild(userCard);
  });
}
initPage();
