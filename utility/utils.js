export async function safeFetch(url, token, options = {}) {
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };
  const response = await fetch(url, {
    ...options,
    headers,
  });
  if (response.status === 401) {
    sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
    sessionStorage.clear();
    window.location.href = "../index.html";
    return;
  }
  return await response.json();
}
// utility/uiUtils.js
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loadNavbar(titleText, homePage = "home.html") {
  const navRes = await fetch("/components/navbar.html");
  const navHTML = await navRes.text();
  document.getElementById("navbar-placeholder").innerHTML = navHTML;
  await import("../scripts/navbar.js");

  document.getElementById("page-title").innerHTML = titleText;
  const backButton = document.getElementById("back-button");
  backButton.disabled = false;
  backButton.addEventListener("click", () => {
    window.location.href = `/pages/${homePage}`;
  });

  document.getElementById("logout-button").addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "../index.html";
  });

  document.getElementById("refresh-button").addEventListener("click", () => {
    location.reload();
  });
}

export function toggleLoading(show) {
  document.getElementById("main-container").style.display = show
    ? "none"
    : "flex";
  document.getElementById("loading-message").style.display = show
    ? "flex"
    : "none";
}
export function renderUserWelcome(userMappings) {
  document.getElementById(
    "user-name"
  ).innerHTML = `Welcome,<br>${userMappings.userFilter.fullName}`;
}
export function createTable(headers = [], rows = []) {
  const table = document.createElement("table");

  // Thead
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);

  // Tbody
  const tbody = document.createElement("tbody");
  rows.forEach((row) => {
    const tr = document.createElement("tr");
    row.forEach((cellVal) => {
      const td = document.createElement("td");
      td.textContent = cellVal;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  return table;
}

export function parseDate(date) {
  const [datePart, ,] = date.split(" ");
  return datePart;
}

export function parseDuration(duration) {
  const cleanDuration = duration.split(".")[0];
  return cleanDuration;
}

export function parseStartEndTime(time) {
  const [, timePart, period] = time.split(" ");
  const [hr, min] = timePart.split(":");
  const cleanTime = `${hr}:${min} ${period}`;
  return cleanTime;
}
