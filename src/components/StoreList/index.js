import React, { useState, useEffect } from "react";
import "./index.css";

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [ratingMap, setRatingMap] = useState({});
  const [searchName, setSearchName] = useState("");
  const [searchAddress, setSearchAddress] = useState("");

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const fetchStores = async () => {
    try {
      const res = await fetch("https://storeproject-backend.onrender.com/api/stores", {
        headers: { Authorization: `Bearer ${getCookie("token")}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch stores");
      setStores(data);

      
      const map = {};
      data.forEach((store) => {
        if (store.user_rating) map[store.id] = store.user_rating;
      });
      setRatingMap(map);
    } catch (err) {
      alert(err.message);
    }
  };

  const submitRating = async (storeId, rating) => {
    if (!rating || rating < 1 || rating > 5) {
      alert("Rating must be 1-5");
      return;
    }

    try {
      const res = await fetch("https://storeproject-backend.onrender.com/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
        body: JSON.stringify({ store_id: storeId, rating }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Rating failed");
      fetchStores(); 
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  
  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchName.toLowerCase()) &&
      store.address.toLowerCase().includes(searchAddress.toLowerCase())
  );

  return (
    <div className="storelist-container">
      <h2>Stores</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Address"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
        />
      </div>

      {filteredStores.length === 0 && <p>No stores found</p>}

      {filteredStores.map((store) => (
        <div key={store.id} className="store-card">
          <h3>{store.name}</h3>
          <p>Address: {store.address}</p>
          <p>Average Rating: {store.avg_rating || "N/A"}</p>
          <p>Your Rating: {store.user_rating || "N/A"}</p>
          <input
            type="number"
            min="1"
            max="5"
            value={ratingMap[store.id] || ""}
            onChange={(e) =>
              setRatingMap({ ...ratingMap, [store.id]: e.target.value })
            }
          />
          <button onClick={() => submitRating(store.id, ratingMap[store.id])}>
            Submit/Update Rating
          </button>
        </div>
      ))}
    </div>
  );
};

export default StoreList;
