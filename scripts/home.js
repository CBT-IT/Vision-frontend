import { getUserCount } from "../utility/backendCalls.js";

const token = sessionStorage.getItem("idToken");
const user = sessionStorage.getItem("userEmail");

async function initHomepage() {
  if (!token) {
    window.location.href = "../index.html";
    return;
  }
  const count = await getUserCount(token);
  document.getElementById("user").innerHTML = user;
  document.getElementById("count").innerHTML = count;
  document.getElementById("logout-button").addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "../index.html";
  });
}

initHomepage();
