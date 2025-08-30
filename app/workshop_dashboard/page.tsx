"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const workshopIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function WorkshopDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [shop, setShop] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetch("/api/shop/list")
      .then((res) => res.json())
      .then((data) => {
        const found = data.shops?.find((s: any) => s.id === id);
        setShop(found);
      });
  }, [id]);

  if (!shop) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl font-bold">{shop.name}</h1>
          <p className="mt-2 text-lg">{shop.address}</p>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto p-6 -mt-10 relative z-10">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl"
          >
            <h2 className="text-2xl font-semibold mb-3">About Us</h2>
            <p className="text-gray-700 leading-relaxed">{shop.description}</p>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl"
          >
            <h2 className="text-2xl font-semibold mb-4">Services</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {shop.services?.map((service: any, i: number) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  key={service.id || i}
                  className="p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl text-center font-medium shadow"
                >
                  {service.name}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Owner Info */}
          <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold mb-2">Owner Info</h2>
            <p className="font-medium">{shop.owner}</p>
            <p className="text-gray-600">📞 {shop.phone}</p>
            <p className="text-gray-600">✉️ {shop.email}</p>
          </div>

          {/* Map */}
          <div className="bg-white/90 backdrop-blur-lg p-4 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold mb-2">Location</h2>
            <div className="h-48 rounded-lg overflow-hidden">
              {shop.latitude && shop.longitude && (
                <MapContainer
                  center={[shop.latitude, shop.longitude]}
                  zoom={13}
                  scrollWheelZoom={false}
                  className="h-full w-full"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[shop.latitude, shop.longitude]} icon={workshopIcon}>
                    <Popup>{shop.name}</Popup>
                  </Marker>
                </MapContainer>
              )}
              
            </div>
            <p className="text-xs text-gray-500">
                      <b>Latitude:</b> {shop.latitude} <b>Longitude:</b> {shop.longitude}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
