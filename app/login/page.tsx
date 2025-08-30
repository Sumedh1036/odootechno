"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "", role: "" });
  const router = useRouter();

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!form.role) {
      alert("Please select a role.");
      return;
    }
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      // Redirect based on role
      if (data.role === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/user");
      }
    } else {
      alert(JSON.stringify(data));
    }
  }

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-5">
        <input type="email" placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="px-2 py-1 rounded border"
          required
        >
          <option value="" disabled>Select role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="worker">Worker</option>
        </select>
        <button className="bg-green-600 text-white px-4 py-2 rounded">Login</button>
      </form>
    </div>
  );
}
