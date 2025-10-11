import React, { useState } from "react";
import "./index.css";

const Login = ({ onLogin, onSwitchSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://storeproject-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log(data)
      if (!res.ok) throw new Error(data.message || "Login failed");

      setCookie("token", data.token, 1);
      setCookie("role", data.user.role, 1);
      onLogin(data.user.role);
      console.log(data.user.role)
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      <p onClick={onSwitchSignup} className="switch-link">Don't have an account? Signup</p>
    </div>
  );
};

export default Login;
