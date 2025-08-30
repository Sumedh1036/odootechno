"use client";
import { useState } from "react";

export default function AddShopForm() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    owner: "",
    phone: "",
    email: "",
    latitude: "",
    longitude: "",
    services: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch("/api/shop/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        services: form.services.split(",").map((s) => s.trim()),
      }),
    });
    const data = await res.json();
    alert(JSON.stringify(data));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-8">
      <input placeholder="Shop Name" onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
      <input placeholder="Description" onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
      <input placeholder="Address" onChange={e => setForm(f => ({ ...f, address: e.target.value }))} required />
      <input placeholder="Owner" onChange={e => setForm(f => ({ ...f, owner: e.target.value }))} required />
      <input placeholder="Phone" onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
      <input placeholder="Email" type="email" onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
      <input placeholder="Latitude" type="number" step="any" onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))} required />
      <input placeholder="Longitude" type="number" step="any" onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))} required />
      <input placeholder="Services (comma separated)" onChange={e => setForm(f => ({ ...f, services: e.target.value }))} required />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Shop</button>
    </form>
  );
}
