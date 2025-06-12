import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDp84G29cJNOo5b9V-_zN86jum13R7C8BI",
  authDomain: "visiondashboard-3e8d8.firebaseapp.com",
  projectId: "visiondashboard-3e8d8",
  storageBucket: "visiondashboard-3e8d8.firebasestorage.app",
  messagingSenderId: "60909404106",
  appId: "1:60909404106:web:362f819f079b3a76655933",
  measurementId: "G-E32FB13WFN",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function signInUser(email, password) {
  try {
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredentials.user;
  } catch (error) {
    console.error(error.message);
  }
}

export function getSessionToken() {
  return sessionStorage.getItem("idToken");
}
export function getSessionUser() {
  return sessionStorage.getItem("userEmail");
}
export function redirectToLogin() {
  sessionStorage.clear();
  window.location.href = "../index.html";
}
export async function validateSession() {
  const token = getSessionToken();
  const user = getSessionUser();
  if (!token || !user) {
    redirectToLogin();
    return null;
  }
  return { token, user };
}
