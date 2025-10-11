import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import StoreList from "./components/StoreList";
import AdminDashboard from "./components/AdminDashboard";
import OwnerDashboard from "./components/OwnerDashboard";
import UpdatePassword from "./components/UpdatePassword";
import "./App.css";

function App() {
  const [role, setRole] = useState(null);
  const [showSignup, setShowSignup] = useState(false);


  useEffect(() => {
    const match = document.cookie.match(/role=(\w+)/);
    if (match) setRole(match[1]);
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; Max-Age=-99999999; path=/";
    document.cookie = "role=; Max-Age=-99999999; path=/";
    setRole(null);
  };

  if (!role) {
    return showSignup ? (
      <Signup
        onSwitchLogin={() => setShowSignup(false)}
        onLogin={setRole} // signup logs in automatically
      />
    ) : (
      <Login
        onLogin={setRole}
        onSwitchSignup={() => setShowSignup(true)}
      />
    );
  }

  let dashboard;
  if (role === "ADMIN") {
    dashboard = <AdminDashboard />;
  } else if (role === "OWNER") {
    dashboard = <OwnerDashboard />;
  } else if (role === "USER") {
    dashboard = (
      <div>
        <UpdatePassword />
        <StoreList />
      </div>
    );
  }

  return (
    <div>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
      {dashboard}
    </div>
  );
}

export default App;
