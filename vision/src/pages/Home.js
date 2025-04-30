import React from "react";
import { auth } from "../auth/firebaseConfig";
import { signOut } from "firebase/auth";
import "../pages/styles/home.css";

export default function Dashboard() {
  return (
    <div className="home-page-container">
      <div className="home-main-nav-container">
        <div className="home-header">VISION</div>
        <div className="home-nav-items">
          <div className="home-welcome"></div>
        </div>
      </div>
      <div className="home-data-container"></div>
    </div>
  );
}
