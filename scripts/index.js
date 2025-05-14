import { signInUser } from "../utility/auth.js";

const sign_in_form = document.getElementById("sign-in-form");
const input_email = document.getElementById("input-email");
const input_password = document.getElementById("input-password");
const sign_in_button = document.getElementById("sign-in-button");

input_password.disabled = true;
sign_in_button.disabled = true;

input_email.addEventListener("click", () => {
  input_password.value = "";
});

input_email.addEventListener("input", () => {
  const email = input_email.value;
  const isValidEmail = email.endsWith("@cbtarchitects.com");
  input_password.disabled = !isValidEmail;
  sign_in_button.disabled = !(isValidEmail && input_password.value.length > 0);
});

input_password.addEventListener("input", () => {
  const password = input_password.value;
  sign_in_button.disabled = !password.length > 0;
});

sign_in_form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = input_email.value;
  const password = input_password.value;
  try {
    const user = await signInUser(email, password);
    const token = await user.getIdToken();
    // 🔐 Save to sessionStorage
    sessionStorage.setItem("userEmail", user.email);
    sessionStorage.setItem("idToken", token);
    const redirectPath =
      sessionStorage.getItem("redirectAfterLogin") || "pages/home.html";
    sessionStorage.removeItem("redirectAfterLogin");
    window.location.href = redirectPath;
  } catch (err) {
    alert("Login Failed");
  }
});
