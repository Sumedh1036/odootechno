"use client";

import { useState, useEffect } from "react";
import { Star, MapPin, List, Grid, Search, Map } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Dashboard() {
  const [view, setView] = useState("list");
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [distanceFilter, setDistanceFilter] = useState("");
  const [sortBy, setSortBy] = useState("nearby");
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    router.push("/");
  };

  const workshops = [
    {
      id: 1,
      name: "Babu Mechanic",
      status: "Open",
      distance: 2.5,
      location: "Silver Auditorium, Ahmedabad, Gujarat",
      rating: 4,
      image: "https://source.unsplash.com/400x200/?car,workshop",
    },
    {
      id: 2,
      name: "Ramesh Automobiles",
      status: "Closed",
      distance: 12,
      location: "Silver Auditorium, Ahmedabad, Gujarat",
      rating: 3,
      image: "https://source.unsplash.com/400x200/?mechanic,garage",
    },
    {
      id: 3,
      name: "Car Garage",
      status: "Open",
      distance: 5,
      location: "Near Gota, Ahmedabad, Gujarat",
      rating: 5,
      image: "https://source.unsplash.com/400x200/?garage,car",
    },
  ];

  // Filtering + Search
  let filteredWorkshops = workshops.filter((w) => {
    if (showOpenOnly && w.status !== "Open") return false;
    if (statusFilter && w.status !== statusFilter) return false;
    if (distanceFilter && w.distance > parseFloat(distanceFilter)) return false;
    if (search && !w.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Sorting
  if (sortBy === "nearby") {
    filteredWorkshops = filteredWorkshops.sort((a, b) => a.distance - b.distance);
  } else if (sortBy === "rated") {
    filteredWorkshops = filteredWorkshops.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md fixed w-full top-0 z-20">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          OnRoadCare
        </h1>
        <div className="flex gap-8">
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => router.push("/login")}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl shadow-md"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/register")}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl shadow-md"
              >
                Register
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl shadow-md"
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* Banner Image (full width) */}
      <div className="mt-[72px]"> {/* Push content below fixed navbar */}
        <div className="w-full">
          <Image
            src="/images/carmechanic.jpg"
            alt="Workshop Banner"
            width={1920}
            height={600}
            className="w-full h-[400px] object-cover"
            priority
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-4 bg-white rounded-xl shadow p-3 mb-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showOpenOnly}
              onChange={(e) => setShowOpenOnly(e.target.checked)}
              className="h-4 w-4"
            />
            Show open only
          </label>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded-xl border shadow-sm"
          >
            <option value="">Status</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            value={distanceFilter}
            onChange={(e) => setDistanceFilter(e.target.value)}
            className="p-2 rounded-xl border shadow-sm"
          >
            <option value="">Distance</option>
            <option value="5">Within 5 km</option>
            <option value="10">Within 10 km</option>
            <option value="15">Within 15 km</option>
          </select>

          <div className="flex items-center gap-2 ml-auto text-sm">
            <span>Sort by:</span>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                value="nearby"
                checked={sortBy === "nearby"}
                onChange={() => setSortBy("nearby")}
              />
              Nearby
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                value="rated"
                checked={sortBy === "rated"}
                onChange={() => setSortBy("rated")}
              />
              Most Rated
            </label>
          </div>
        </div>

        {/* Search + View Toggle */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center w-full max-w-lg border rounded-xl px-3 py-2 bg-white shadow">
            <Search className="h-4 w-4 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search Workshop"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-sm bg-transparent"
            />
          </div>

          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-lg border shadow ${
              view === "list" ? "bg-indigo-500 text-white" : "bg-white"
            }`}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-lg border shadow ${
              view === "grid" ? "bg-indigo-500 text-white" : "bg-white"
            }`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("map")}
            className={`p-2 rounded-lg border shadow ${
              view === "map" ? "bg-indigo-500 text-white" : "bg-white"
            }`}
          >
            <Map className="h-4 w-4" />
          </button>
        </div>

        {/* Workshop List/Grid/Map */}
        {view === "map" ? (
          <div className="h-96 w-full bg-gray-200 flex items-center justify-center rounded-xl shadow">
            <span className="text-gray-600">🗺️ Map View (Google Maps integration here)</span>
          </div>
        ) : (
          <div
            className={
              view === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {filteredWorkshops.length > 0 ? (
              filteredWorkshops.map((workshop) => (
                <motion.div
                  key={workshop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
                >
                  <img
                    src={workshop.image}
                    alt={workshop.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold">{workshop.name}</h2>
                      <span
                        className={`text-sm font-medium px-3 py-1 rounded-xl ${
                          workshop.status === "Open"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {workshop.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-purple-500" />
                      {workshop.location}
                    </p>

                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < workshop.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-sm text-gray-500">
                      {workshop.distance} km away
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-600">No workshops found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
