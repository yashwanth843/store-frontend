import React, { useState } from "react";
import "./index.css";

const Signup = ({ onSwitchLogin }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://storeproject-backend.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("Signup response:", data);

      if (!res.ok) {
        
        if (data.errors && data.errors.length > 0) {
          throw new Error(data.errors[0].msg);
        }
        throw new Error(data.error || "Signup failed");
      }

      alert("Signup successful! Please login.");
      setForm({ name: "", email: "", address: "", password: "" });

      
      onSwitchLogin();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Signup</button>
      </form>
      <p onClick={onSwitchLogin} className="switch-link">
        Already have an account? Login
      </p>
    </div>
  );
};

export default Signup;
