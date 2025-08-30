"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  async function handleSubmit(e: any) {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    alert(JSON.stringify(data));
  }

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-2xl font-bold">Register</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-5">
        <input type="text" placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input type="email" placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Register</button>
      </form>
    </div>
  );
}
