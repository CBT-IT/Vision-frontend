import {
  getUserCount,
  getUserMappingsByEmail,
  getUserInfo,
  getSyncInfo,
  getSyncInfoCount,
  getPluginUse,
  getPluginUseCount,
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

    // const userInfo = await getUserInfo(token);
    // const userInfoCount = await getUserCount(token);

    // const syncInfo = await getSyncInfo(token);
    // const syncInfoCount = await getSyncInfoCount(token);
    // const pluginUse = await getPluginUse(token);
    // const pluginUseCount = await getPluginUseCount(token);
    // const viewBookmarks = await getViewBookmarks(token);
    // console.log(userMappings);

    await updatePage();
    await sleep(1000);
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

  const user_name = document.getElementById("user-name");
  const userMappings = await getUserMappingsByEmail(token, user);
  user_name.innerHTML = `Welcome,<br>${userMappings.userFilter.fullName}`;

  document.getElementById("logout-button").addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "../index.html";
  });

  document.getElementById("refresh-button").addEventListener("click", () => {
    initHomepage();
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

initHomepage();
