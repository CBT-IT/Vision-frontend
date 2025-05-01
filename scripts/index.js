import { signInUser } from "../utility/auth.js";

const sign_in_form = document.getElementById("sign-in-form");

sign_in_form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("input-email").value;
  const password = document.getElementById("input-password").value;
  try {
    const user = await signInUser(email, password);
    const token = await user.getIdToken();
    // 🔐 Save to sessionStorage
    sessionStorage.setItem("userEmail", user.email);
    sessionStorage.setItem("idToken", token);
    window.location.href = "pages/home.html";
  } catch (err) {
    alert("Login Failed: " + err.message);
  }
});
