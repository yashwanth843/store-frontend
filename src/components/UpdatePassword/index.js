import React, { useState } from "react";
import "./index.css";

const UpdatePassword = () => {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [loading, setLoading] = useState(false);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const API_BASE = "https://storeproject-backend.onrender.com";
  const API_PATH = "/api/user/change-password"; 
  const API_METHOD = "POST";

  const handleUpdate = async () => {
    if (!current) return alert("Please enter your current password.");
    if (!newPass || newPass.length < 8)
      return alert("New password must be at least 8 characters.");

    const token = getCookie("token");
    if (!token) {
      alert("Auth token not found. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      const url = `${API_BASE}${API_PATH}`;
      console.log("Sending request to:", url, "method:", API_METHOD);

      const res = await fetch(url, {
        method: API_METHOD,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: current,    
          newPassword: newPass,    
        }),
      });

      console.log("HTTP", res.status, res.statusText);
      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const data = await res.json();
        console.log("JSON response:", data);
        if (!res.ok) {
          throw new Error(data.error || data.message || JSON.stringify(data));
        }
        alert("Password updated successfully!");
        setCurrent("");
        setNewPass("");
      } else {
        const text = await res.text();
        console.error("Non-JSON response (snippet):", text.slice(0, 1000));
        throw new Error(
          `Server returned non-JSON response (status ${res.status}). Response snippet:\n\n${text.slice(
            0,
            500
          )}`
        );
      }
    } catch (err) {
      console.error("handleUpdate error:", err);
      alert(err.message || "An unexpected error occurred. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-password-container">
      <h3>Update Password</h3>

      <input
        type="password"
        placeholder="Current Password"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
      />

      <input
        type="password"
        placeholder="New Password"
        value={newPass}
        onChange={(e) => setNewPass(e.target.value)}
      />

      <div style={{ marginTop: 10 }}>
        <button onClick={handleUpdate} disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
};

export default UpdatePassword;
