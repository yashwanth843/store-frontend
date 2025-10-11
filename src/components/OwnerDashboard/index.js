import React, { useState, useEffect } from "react";
import "./index.css";

const OwnerDashboard = () => {
  const [storesData, setStoresData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const parseJSONSafe = async (res) => {
    const text = await res.text();
    try {
      const data = JSON.parse(text || "{}");
      if (!res.ok) throw new Error(data.error || data.message || "Server error");
      return data;
    } catch (err) {
      
      throw new Error("Server returned unexpected response: " + text.slice(0, 200));
    }
  };

  const fetchOwnerData = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://storeproject-backend.onrender.com/api/stores/owner", {
        headers: { Authorization: `Bearer ${getCookie("token")}` },
      });
      const data = await parseJSONSafe(res);
      setStoresData(Array.isArray(data) ? data : []);
    } catch (err) {
      alert(err.message);
      setStoresData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      alert("Please fill both password fields.");
      return;
    }
    if (newPassword.length < 8) {
      alert("New password must be at least 8 characters.");
      return;
    }

    setPwLoading(true);
    try {
      const res = await fetch("https://storeproject-backend.onrender.com/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
        body: JSON.stringify({ oldPassword: currentPassword, newPassword }),
      });
      const data = await parseJSONSafe(res);
      alert("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      alert(err.message);
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="owner-dashboard" style={{ maxWidth: 900, margin: "20px auto", padding: 16 }}>
      <h2>Owner Dashboard</h2>

      
      <div className="owner-password" style={{ marginBottom: 20, padding: 12, borderRadius: 8, background: "#f7f7f7" }}>
        <h3 style={{ marginTop: 0 }}>Update Password</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={{ flex: "1 1 220px", padding: 8 }}
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ flex: "1 1 220px", padding: 8 }}
          />
          <button onClick={handleChangePassword} disabled={pwLoading} style={{ padding: "8px 12px" }}>
            {pwLoading ? "Updating..." : "Update Password"}
          </button>
        </div>
        <small style={{ color: "#555" }}>
          Password must be 8-16 chars, include at least one uppercase and one special character.
        </small>
      </div>

      
      <div>
        <h3>Your Stores & Ratings</h3>
        {loading && <p>Loading...</p>}
        {!loading && storesData.length === 0 && <p>No stores found for your account.</p>}

        {storesData.map((entry) => {
          const store = entry.store || {};
          const raters = entry.raters || [];
          const avg = entry.avg_rating ?? 0;
          return (
            <div key={store.id} className="owner-store-card" style={{ marginBottom: 18, borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
              <div style={{ background: "#2f6fba", color: "white", padding: 12 }}>
                <strong style={{ fontSize: 18 }}>{store.name || "Unnamed Store"}</strong>
                <div style={{ fontSize: 14, opacity: 0.95 }}>{store.address}</div>
                <div style={{ marginTop: 6 }}><strong>Average Rating:</strong> {avg ? Number(avg).toFixed(2) : "N/A"}</div>
              </div>

              <div style={{ padding: 12, background: "#fff" }}>
                <h4 style={{ marginTop: 0 }}>Users who rated this store</h4>
                {raters.length === 0 && <p>No ratings yet.</p>}
                {raters.length > 0 && (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#f0f6fb" }}>
                        <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #e0e0e0" }}>User</th>
                        <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #e0e0e0" }}>Rating</th>
                        <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #e0e0e0" }}>When</th>
                      </tr>
                    </thead>
                    <tbody>
                      {raters.map((r) => (
                        <tr key={`${r.user_id}-${r.updated_at || r.user_id}`} style={{ borderBottom: "1px solid #f2f2f2" }}>
                          <td style={{ padding: 8 }}>{r.user_name || r.name || "Unknown"}</td>
                          <td style={{ padding: 8 }}>{r.rating}</td>
                          <td style={{ padding: 8 }}>{r.updated_at ? new Date(r.updated_at).toLocaleString() : "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OwnerDashboard;
