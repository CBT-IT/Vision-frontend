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
  const step1 = document.getElementById("step1");
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
    step1.classList.remove("loading-steps-ready");
    step2.classList.remove("loading-steps-ready");
    step3.classList.remove("loading-steps-ready");
    step4.classList.remove("loading-steps-ready");
    step5.classList.remove("loading-steps-ready");
    step6.classList.remove("loading-steps-ready");
    step7.classList.remove("loading-steps-ready");
    step8.classList.remove("loading-steps-ready");
    step9.classList.remove("loading-steps-ready");
    initHomepage();
  });
  step1.classList.add("loading-steps-ready");
  const step2 = document.getElementById("step2");
  await populateSessionsCard();
  step2.classList.add("loading-steps-ready");
  const step3 = document.getElementById("step3");
  await populateSyncsCard();
  step3.classList.add("loading-steps-ready");
  const step4 = document.getElementById("step4");
  await populatePluginCard();
  step4.classList.add("loading-steps-ready");
  const step5 = document.getElementById("step5");
  await populateUserCard();
  step5.classList.add("loading-steps-ready");
  const step6 = document.getElementById("step6");
  await populateActiveUsersCard();
  step6.classList.add("loading-steps-ready");
  const step7 = document.getElementById("step7");
  await populateModelsTrackedCard();
  step7.classList.add("loading-steps-ready");
  const step8 = document.getElementById("step8");
  await cloudProjectCard();
  step8.classList.add("loading-steps-ready");
  const step9 = document.getElementById("step9");
  await populateActivityChart();
  step9.classList.add("loading-steps-ready");
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
  const sessionsCard = document.getElementById("sessions-button");
  sessionsCard.addEventListener("click", () => {
    console.log("Sessions Card Clicked");
    window.location.href = "/pages/sessions.html";
  });
}
async function populateSyncsCard() {
  const syncCount = await getSyncInfoCount(token);
  const syncs_button_data = document.getElementById("syncs-button-data");
  syncs_button_data.textContent = syncCount;

  const syncInfoToday = await getSyncInfoToday(token);
  const syncs_button_summary = document.getElementById("syncs-button-summary");
  syncs_button_summary.textContent = `+${syncInfoToday.syncInfo.length}`;

  const syncsCard = document.getElementById("syncs-button");
  syncsCard.addEventListener("click", () => {
    console.log("Syncs Card Clicked");
    window.location.href = "/pages/syncs.html";
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
async function cloudProjectCard() {
  const count = await getCloudProjectsCount(token);
  const cloud_projects_button_data = document.getElementById(
    "cloud-projects-button-data"
  );
  cloud_projects_button_data.textContent = count.count;
}
async function populateModelsTrackedCard() {
  const count = await getModelsTrackedCount(token);
  const models_tracked_button_data = document.getElementById(
    "models-tracked-button-data"
  );
  models_tracked_button_data.textContent = count.count;

  const modelsTrackedCard = document.getElementById("models-tracked-button");
  modelsTrackedCard.addEventListener("click", async () => {
    console.log("Models Tracked card clicked");
    const models = await getModelsTracked(token);
    console.log(models);
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

initHomepage();
