"use client";

import { useState, useEffect } from "react";
import { Star, MapPin, List, Grid, Search, Map } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import L from "leaflet";

// Dynamic imports for React-Leaflet (to avoid SSR issues in Next.js)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

// Custom marker icon (fix for Next.js + Leaflet)
const workshopIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Dashboard() {
  const [view, setView] = useState("list");
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [distanceFilter, setDistanceFilter] = useState("");
  const [sortBy, setSortBy] = useState("nearby");
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [shops, setShops] = useState<any[]>([]);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    fetch("/api/shop/list")
      .then((res) => res.json())
      .then((data) => setShops(data.shops || []));
  }, []);

  // Filtering + Search
  let filteredShops = shops.filter((shop) => {
    console.log("\n\n\n------calllll")
    // You can add more filters as needed
    if (search && !shop.name.toLowerCase().includes(search.toLowerCase()) && !shop.address.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  // Sorting (example: by name)
  filteredShops = filteredShops.sort((a, b) => a.name.localeCompare(b.name));

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
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                setIsLoggedIn(false);
                router.push("/");
              }}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl shadow-md"
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* Banner */}
      <div className="mt-[72px]">
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
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 bg-white rounded-xl shadow p-3 mb-6">
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

        {/* View Section */}
        {view === "map" ? (
          <div className="h-96 w-full rounded-xl overflow-hidden shadow">
            {filteredShops.map(
                (shop) =>
            <MapContainer
            //   center={[23.0225, 72.5714]}
              center={[shop.latitude, shop.longitude]}

              zoom={12}
              className="h-full w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              />
              
                   
                    <Marker
                      key={shop.id}
                      position={[shop.latitude, shop.longitude]}
                      icon={workshopIcon}
                    >
                      <Popup>
                        <b>{shop.name}</b>
                        <br />
                        {shop.address}
                        <br />
                        {shop.phone}
                      </Popup>
                    </Marker>
                  
              {/* )} */}
            </MapContainer>
        )}
          </div>
        ) : (
          <div
            className={
              view === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {filteredShops.length > 0 ? (
              filteredShops.map((shop) => (
                <motion.div
                  key={shop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
                >
                  {/* You can add an image field to Shop if needed */}
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold">{shop.name}</h2>
                      <span className="text-sm font-medium px-3 py-1 rounded-xl bg-blue-100 text-blue-700">
                        {shop.owner}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-purple-500" />
                      {shop.address}
                    </p>
                    <div className="flex items-center gap-1 flex-wrap">
                      {shop.services?.map((service: any) => (
                        <span
                          key={service.id}
                          className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs mr-2 mb-1"
                        >
                          {service.name}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">{shop.phone}</p>
                    <button
                      onClick={() =>
                        router.push(`/workshop_dashboard?id=${shop.id}`)
                      }
                      className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600"
                    >
                      View Details
                    </button>
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