import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../auth/firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../pages/styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = email.endsWith("@cbtarchitects.com");
  const canEnablePassword = isValidEmail;
  const canEnableButton = isValidEmail && password.length > 0;

  const handleEmailClick = () => {
    setPassword("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.endsWith("@cbtarchitects.com")) {
      setError("Only CBT email addresses allowed.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-header">
        <div>VISION</div>
      </div>
      <div className="login-login-container">
        <form onSubmit={handleLogin}>
          <input
            id="login-input-mail"
            className="login-input"
            type="email"
            value={email}
            placeholder="CBT Email"
            onChange={(e) => setEmail(e.target.value)}
            onClick={handleEmailClick}
          />
          <br />
          <br />
          <input
            disabled={!canEnablePassword}
            id="login-input-password"
            className={`login-input ${
              !canEnablePassword ? "login-disabled" : ""
            }`}
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <br />
          <button
            className={`login-button ${
              !canEnableButton ? "login-disabled" : ""
            }`}
            type="submit"
            disabled={!canEnableButton}
          >
            Sign in
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
