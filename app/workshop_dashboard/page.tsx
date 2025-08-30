"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";

export default function WorkshopDetailPage() {
  const router = useRouter();

  const shop = {
    name: "AutoCare Garage",
    description:
      "We provide premium car repair and maintenance with expert mechanics, modern tools, and fast service. Your car is our responsibility.",
    services: [
      "Oil Change",
      "Engine Repair",
      "Tire Replacement",
      "Car Wash",
      "Battery Service",
      "Brake Service",
    ],
    location: { lat: 23.0225, lng: 72.5714 },
    address: "Silver Auditorium, Ahmedabad, Gujarat",
    owner: "Marc Demo",
    phone: "+1 555-555-5556",
    email: "info@autocare.com",
  };

  const [reviews, setReviews] = useState([
    { user: "Mihir Admin", rating: 5, text: "Excellent service and quick delivery!" },
  ]);
  const [newReview, setNewReview] = useState("");

  const addReview = () => {
    if (!newReview) return;
    setReviews([...reviews, { user: "You", rating: 5, text: newReview }]);
    setNewReview("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      {/* Hero Section */}
      <div className="relative h-64 bg-[url('https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center">
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
              {shop.services.map((service, i) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  key={i}
                  className="p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl text-center font-medium shadow"
                >
                  {service}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Reviews */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl"
          >
            <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
            <div className="space-y-4">
              {reviews.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 border-l-4 border-yellow-400 bg-white rounded-lg shadow-sm"
                >
                  <p className="font-semibold">{r.user} ⭐⭐⭐⭐⭐</p>
                  <p className="text-gray-700">{r.text}</p>
                </motion.div>
              ))}
            </div>
            {/* Add Review */}
            <div className="flex gap-2 mt-4">
              <input
                type="text"
                placeholder="Write a review..."
                className="flex-1 border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400"
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
              />
              <button
                onClick={addReview}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg shadow"
              >
                Send
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Sticky Contact Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-20 space-y-6"
          >
            {/* Owner Info */}
            <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-xl">
              <h2 className="text-xl font-semibold mb-2">Owner Info</h2>
              <p className="font-medium">{shop.owner}</p>
              <p className="text-gray-600">📞 {shop.phone}</p>
              <p className="text-gray-600">✉️ {shop.email}</p>
              <button className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg shadow">
                Book Service
              </button>
            </div>

            {/* Map */}
            <div className="bg-white/90 backdrop-blur-lg p-4 rounded-2xl shadow-xl">
              <h2 className="text-xl font-semibold mb-2">Location</h2>
              <div className="h-48 rounded-lg overflow-hidden">
                <MapContainer
                  center={[shop.location.lat, shop.location.lng]}
                  zoom={13}
                  scrollWheelZoom={false}
                  className="h-full w-full"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[shop.location.lat, shop.location.lng]}>
                    <Popup>{shop.name}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
