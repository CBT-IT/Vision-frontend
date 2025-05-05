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

  await import("../scripts/navbar.js");

  const page_title = document.getElementById("page-title");
  page_title.innerHTML = "Home<br>Page";

  const back_button = document.getElementById("back-button");
  back_button.disabled = true;

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

  await populateSessionsCard();
  await populateSyncsCard();
  await populatePluginCard();
  await populateUserCard();
  await populateActiveUsersCard();
  await populateActivityChart();
}
async function populateSessionsCard() {
  const sessionsToday = await getSessionsInfoToday(token);
  const sessionsTodayCount = sessionsToday.sessionsInfo.length;
  const sessionsCount = await getSessionsCount(token);
  const sessions_button_data = document.getElementById("sessions-button-data");
  const sessions_button_summary = document.getElementById(
    "sessions-button-summary"
  );
  sessions_button_data.textContent = sessionsCount;
  sessions_button_summary.textContent = `+${sessionsTodayCount}`;
}
async function populateSyncsCard() {
  const syncCount = await getSyncInfoCount(token);
  const syncs_button_data = document.getElementById("syncs-button-data");
  syncs_button_data.textContent = syncCount;

  const syncInfoToday = await getSyncInfoToday(token);
  const syncs_button_summary = document.getElementById("syncs-button-summary");
  syncs_button_summary.textContent = `+${syncInfoToday.syncInfo.length}`;

  const sessionsCard = document.getElementById("sessions-button");
  sessionsCard.addEventListener("click", () => {
    console.log("Sessions Card Clicked");
    window.location.href = "/pages/sessions.html";
  });
}
async function populatePluginCard() {
  const pluginCount = await getPluginUseCount(token);
  const plugin_button_data = document.getElementById("plugin-button-data");
  plugin_button_data.textContent = pluginCount;

  const pluginUseToday = await getPluginUseToday(token);
  const plugin_button_summary = document.getElementById(
    "plugin-button-summary"
  );
  plugin_button_summary.textContent = `+${pluginUseToday.pluginUse.length}`;
}
async function populateUserCard() {
  const userCount = await getUserCount(token);
  const user_button_data = document.getElementById("user-button-data");
  user_button_data.textContent = userCount.count;
}
async function populateActiveUsersCard() {
  const activeUserCount = await getActiveUsersCount(token);
  const active_user_button_data = document.getElementById(
    "active-user-button-data"
  );
  active_user_button_data.textContent = activeUserCount.count;
}
async function populateActivityChart() {
  const chartSpace = document.getElementById("right-data-chart");
  // Clear any existing canvas if you're refreshing the chart
  chartSpace.innerHTML = `<canvas id="activityChart"></canvas>`;

  const data = await getActivityChartData(token);
  console.log(data);

  const labels = Object.keys(data); // dates
  const usageCounts = Object.values(data); // session counts

  const ctx = document.getElementById("activityChart").getContext("2d");

  new Chart(ctx, {
    type: "line", // or "bar" if you prefer
    data: {
      labels: labels,
      datasets: [
        {
          label: "Entries",
          data: usageCounts,
          borderColor: "#00bac6",
          backgroundColor: "rgba(0, 186, 198, 0.2)",
          fill: true,
          tension: 0,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: { display: false },
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: "Usage Count" },
        },
      },
    },
  });
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

initHomepage();
