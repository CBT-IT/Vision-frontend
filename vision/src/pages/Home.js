import React from "react";
import { auth } from "../auth/firebaseConfig";
import { signOut } from "firebase/auth";

export default function Dashboard() {
  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <h1>CBT Vision Dashboard</h1>
      <button onClick={() => signOut(auth)}>Logout</button>
    </div>
  );
}
