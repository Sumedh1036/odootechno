"use client";
import React, { useState, useEffect } from "react";

interface ProfilePageProps {
  userId: number;
}

export default function ProfilePage({ userId }: ProfilePageProps) {
  const [shops, setShops] = useState<any[]>([]);
  const [selectedShop, setSelectedShop] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("mechanic");
  

  // Safely parse user from localStorage
  const user = JSON.parse(localStorage.getItem("userId") || "{}");
  console.log("User from localStorage:", user);

  useEffect(() => {
    async function fetchData() {
      try {
        // Use userId from props or fallback to user.id from localStorage
        const id = userId || user;
        if (!id) {
          console.error("No userId provided");
          return;
        }

        const res = await fetch("/api/profile", {
          headers: { "user-id": String(id) },
        });
        const data = await res.json();
        console.log("Profile GET response:", data);

        setShops(data.shops || []);
        setName(data.user?.name || "");
        setRole(data.user?.role || "mechanic");

        if (data.user?.workHistory?.length > 0) {
          setSelectedShop(data.user.workHistory[0].shopId);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    }

    fetchData();
  }, [userId, user.id]);

  const handleSave = async () => {
    try {
      
      // Use userId from props or fallback to user.id from localStorage
      const id = userId || user;
      if (!id) {
        console.error("No userId provided");
        alert("User ID is missing");
        return;
      }

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", "user-id": String(id) },
        body: JSON.stringify({ name, role, selectedShop, user }),
      });
      const data = await res.json();
      console.log("Profile POST response:", data);
      alert(data.message || "Profile updated!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Mechanic Profile</h1>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Name</label>
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Role</label>
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Current Employer</label>
        <select
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={selectedShop}
          onChange={(e) => setSelectedShop(e.target.value)}
        >
          <option value="">Select Shop</option>
          {shops.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-md shadow-md transition duration-200"
      >
        Save
      </button>
    </div>
  );
}