import React, { useState, useEffect } from "react";
import "./index.css";

const AdminDashboard = () => {
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [newStore, setNewStore] = useState({ name: "", email: "", address: "" });
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", address: "", role: "USER" });
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [filterStore, setFilterStore] = useState({ name: "", email: "" });
  const [filterUser, setFilterUser] = useState({ name: "", email: "", role: "" });

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const parseJSON = async (res) => {
    try {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");
      return data;
    } catch (err) {
      throw new Error("Server returned invalid response (not JSON)");
    }
  };

  const fetchStores = async () => {
    try {
      const res = await fetch("https://storeproject-backend.onrender.com/api/admin/stores", {
        headers: { Authorization: `Bearer ${getCookie("token")}` },
      });
      const data = await parseJSON(res);
      setStores(data);
    } catch (err) {
      alert(err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("https://storeproject-backend.onrender.com/api/admin/users", {
        headers: { Authorization: `Bearer ${getCookie("token")}` },
      });
      const data = await parseJSON(res);
      console.log("Users fetched:", data); 
      setUsers(data);
    } catch (err) {
      alert(err.message);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("https://storeproject-backend.onrender.com/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${getCookie("token")}` },
      });
      const data = await parseJSON(res);
      setStats(data);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddStore = async () => {
    const { name, email, address } = newStore;
    if (!name || !email) return alert("Name and Email are required");
    try {
      const res = await fetch("https://storeproject-backend.onrender.com/api/admin/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getCookie("token")}` },
        body: JSON.stringify(newStore),
      });
      await parseJSON(res);
      setNewStore({ name: "", email: "", address: "" });
      fetchStores();
      fetchStats();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddUser = async () => {
    const { name, email, password, address, role } = newUser;
    if (!name || !email || !password) return alert("Name, Email, and Password are required");
    try {
      const res = await fetch("https://storeproject-backend.onrender.com/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getCookie("token")}` },
        body: JSON.stringify(newUser),
      });
      await parseJSON(res);
      setNewUser({ name: "", email: "", password: "", address: "", role: "USER" });
      fetchUsers();
      fetchStats();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchStores();
    fetchUsers();
    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="stats">
        <p>Total Users: {stats.totalUsers}</p>
        <p>Total Stores: {stats.totalStores}</p>
        <p>Total Ratings: {stats.totalRatings}</p>
      </div>

      
      <div className="add-store-form">
        <h3>Add New Store</h3>
        <input placeholder="Name" value={newStore.name} onChange={(e) => setNewStore({ ...newStore, name: e.target.value })} />
        <input placeholder="Email" value={newStore.email} onChange={(e) => setNewStore({ ...newStore, email: e.target.value })} />
        <input placeholder="Address" value={newStore.address} onChange={(e) => setNewStore({ ...newStore, address: e.target.value })} />
        <button onClick={handleAddStore}>Add Store</button>
      </div>

      
      <div className="add-user-form">
        <h3>Add New User</h3>
        <input placeholder="Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
        <input placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
        <input placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
        <input placeholder="Address" value={newUser.address} onChange={(e) => setNewUser({ ...newUser, address: e.target.value })} />
        <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="OWNER">Store Owner</option>
        </select>
        <button onClick={handleAddUser}>Add User</button>
      </div>

      
      <div className="store-list-admin">
        <h3>All Stores</h3>
        <input placeholder="Filter by Name" value={filterStore.name} onChange={(e) => setFilterStore({ ...filterStore, name: e.target.value })} />
        <input placeholder="Filter by Email" value={filterStore.email} onChange={(e) => setFilterStore({ ...filterStore, email: e.target.value })} />
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Address</th><th>Rating</th></tr>
            </thead>
            <tbody>
              {stores
                .filter(s =>
                  (s.name?.toLowerCase().includes(filterStore.name.toLowerCase()) ?? true) &&
                  (s.email?.toLowerCase().includes(filterStore.email.toLowerCase()) ?? true)
                )
                .map(store => (
                  <tr key={store.id || store.email}>
                    <td>{store.name}</td>
                    <td>{store.email}</td>
                    <td>{store.address}</td>
                    <td>{store.avg_rating || "N/A"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      
      <div className="user-list-admin">
        <h3>All Users</h3>
        <input placeholder="Filter by Name" value={filterUser.name} onChange={(e) => setFilterUser({ ...filterUser, name: e.target.value })} />
        <input placeholder="Filter by Email" value={filterUser.email} onChange={(e) => setFilterUser({ ...filterUser, email: e.target.value })} />
        <select value={filterUser.role} onChange={(e) => setFilterUser({ ...filterUser, role: e.target.value })}>
          <option value="">All Roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="OWNER">Store Owner</option>
        </select>
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Address</th><th>Role</th><th>Rating</th></tr>
            </thead>
            <tbody>
              {users
                .filter(u =>
                  (u.name?.toLowerCase().includes(filterUser.name.toLowerCase()) ?? true) &&
                  (u.email?.toLowerCase().includes(filterUser.email.toLowerCase()) ?? true) &&
                  (filterUser.role === "" || u.role === filterUser.role)
                )
                .map(user => (
                  <tr key={user.id || user.email}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.address}</td>
                    <td>{user.role}</td>
                    <td>{user.role === "OWNER" ? user.avg_rating || "N/A" : "-"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
