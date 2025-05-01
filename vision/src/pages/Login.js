import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import "../pages/styles/login.css";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="login-page-container">
      <div className="login-header">VISION</div>
      <div className="login-login-container">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="CBT email address"
            required
          />
          <input
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="passsword"
            required
          />
          <button type="submit" className="login-button">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
