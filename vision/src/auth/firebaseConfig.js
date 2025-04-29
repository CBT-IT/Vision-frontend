import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: REACT_APP_FIREBASE_DOMAIN,
  projectId: REACT_APP_FIREBASE_PROJECTID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
