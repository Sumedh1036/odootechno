"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-10 rounded-2xl flex flex-col items-center gap-5">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to My Auth App</h1>
        <p className="text-gray-600">Please login to continue</p>
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Login
        </button>
        <button
          onClick={() => router.push("/register")}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition"
        >
          Register
        </button>
      </div>
    </div>
  );
}
