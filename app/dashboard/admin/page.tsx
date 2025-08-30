"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    // Verify token with backend
    fetch("/api/auth/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          const data = await res.json();
          if (data.user.role !== "admin") {
            router.push("/");
            return;
          }
          setUser(data.user);
        }
      });
  }, [router]);

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-3xl font-bold">Welcome, {user.name || user.email} 🎉</h1>
      <p className="mt-4">This is your secure dashboard.</p>
      <button
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded"
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}
