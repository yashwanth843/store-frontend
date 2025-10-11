import React, { useState } from "react";
import "./index.css";

const UpdatePassword = () => {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const handleUpdate = async () => {
    if (!newPass || newPass.length < 8) {
      alert("New password must be at least 8 characters");
      return;
    }

    try {
      const res = await fetch("https://storeproject-backend.onrender.com/api/users/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
        body: JSON.stringify({ current_password: current, new_password: newPass }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Password update failed");
      alert("Password updated successfully!");
      setCurrent("");
      setNewPass("");
    } catch (err) {
      alert(err.message);
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
      <button onClick={handleUpdate}>Update Password</button>
    </div>
  );
};

export default UpdatePassword;
