// "use client";
// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import dynamic from "next/dynamic";
// import L from "leaflet";

// // Dynamically import Leaflet components (avoid SSR issues)
// const MapContainer = dynamic(
//     () => import("react-leaflet").then((m) => m.MapContainer),
//     { ssr: false }
// );
// const TileLayer = dynamic(
//     () => import("react-leaflet").then((m) => m.TileLayer),
//     { ssr: false }
// );
// const Marker = dynamic(
//     () => import("react-leaflet").then((m) => m.Marker),
//     { ssr: false }
// );

// const customIcon = new L.Icon({
//     iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
//     iconSize: [30, 45],
//     iconAnchor: [15, 45],
// });

// export default function ServiceRequestPage() {
//     const [name, setName] = useState("");
//     const [desc, setDesc] = useState("");
//     const [serviceType, setServiceType] = useState("Towing");
//     const [serviceTime, setServiceTime] = useState("");
//     const [issue, setIssue] = useState("");
//     const [file, setFile] = useState<File | null>(null);
//     const [location, setLocation] = useState<[number, number] | null>(null); // [lat, lng]

//     // Auto-fetch current location on mount
//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition((pos) => {
//                 setLocation([pos.coords.latitude, pos.coords.longitude]);
//             });
//         }
//     }, []);

//     const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
//     };

//     const handleSubmit = () => {
//         alert(
//             `✅ Submitted:\nName: ${name}\nDesc: ${desc}\nService: ${serviceType}\nTime: ${serviceTime}\nIssue: ${issue}\nFile: ${file?.name || "None"}`
//         );
//     };

//     return (
//         <div className="min-h-screen bg-white p-6 flex items-center justify-center">
//             <motion.div
//                 initial={{ opacity: 0, y: 40 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.7 }}
//                 className="w-full max-w-5xl bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden"
//             >
//                 {/* Header */}
//                 <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 flex justify-between items-center">
//                     <h1 className="text-2xl font-bold text-white flex items-center gap-2">
//                         Service Request
//                     </h1>
//                     <button className="px-5 py-2 bg-white/20 text-white font-medium rounded-lg shadow hover:bg-white/30 transition">
//                         Track Request
//                     </button>
//                 </div>

//                 {/* Form + Map */}
//                 <div className="grid md:grid-cols-2 gap-8 p-8">
//                     {/* Left side form */}
//                     <div className="space-y-5">
//                         <input
//                             type="text"
//                             placeholder="Your Name"
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             className="w-full p-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
//                         />

//                         <textarea
//                             placeholder="Short Description"
//                             value={desc}
//                             onChange={(e) => setDesc(e.target.value)}
//                             className="w-full p-3 rounded-xl border shadow-sm min-h-[80px] focus:ring-2 focus:ring-indigo-400 outline-none"
//                         />

//                         <select
//                             value={serviceType}
//                             onChange={(e) => setServiceType(e.target.value)}
//                             className="w-full p-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
//                         >
//                             <option>Instant Service</option>
//                             <option>Pre Book Slot</option>
//                         </select>

//                         <input
//                             type="datetime-local"
//                             value={serviceTime}
//                             onChange={(e) => setServiceTime(e.target.value)}
//                             className="w-full p-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
//                         />

//                         {/* File Upload */}
//                         <div className="p-3 border-2 border-dashed rounded-xl text-center cursor-pointer hover:bg-gray-50">
//                             <label className="block text-sm text-gray-600 mb-2">
//                                 📷 Upload an Image (Optional)
//                             </label>
//                             <input type="file" onChange={handleFile} className="text-sm" />
//                             {file && (
//                                 <p className="text-xs mt-1 text-gray-500">Selected: {file.name}</p>
//                             )}
//                         </div>

//                         <textarea
//                             placeholder="Detailed Issue"
//                             value={issue}
//                             onChange={(e) => setIssue(e.target.value)}
//                             className="w-full p-3 rounded-xl border shadow-sm min-h-[100px] focus:ring-2 focus:ring-indigo-400 outline-none"
//                         />
//                     </div>

//                     {/* Right side Map */}
//                     <div className="rounded-xl overflow-hidden shadow-lg h-[400px]">
//                         <button
//                             onClick={() => {
//                                 if (navigator.geolocation) {
//                                     navigator.geolocation.getCurrentPosition((pos) =>
//                                         setLocation([pos.coords.latitude, pos.coords.longitude])
//                                     );
//                                 }
//                             }}
//                             className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition"
//                         >
//                             📍 Use My Current Location
//                         </button>

//                         {location ? (
//                             <MapContainer
//                                 center={location}
//                                 zoom={14}
//                                 className="h-full w-full z-0"
//                             >
//                                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                                 <Marker
//                                     position={location}
//                                     icon={customIcon}
//                                     draggable={true}
//                                     eventHandlers={{
//                                         dragend: (e) => {
//                                             const marker = e.target;
//                                             const newPos = marker.getLatLng();
//                                             setLocation([newPos.lat, newPos.lng]); // update state with dragged location
//                                         },
//                                     }}
//                                 />
//                             </MapContainer>
//                         ) : null}
//                     </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex justify-between items-center p-6 border-t bg-gray-50">
//                     <button className="px-6 py-3 bg-purple-500 text-white rounded-xl shadow hover:bg-purple-600 transition">
//                         💬 Chat with Support
//                     </button>
//                     <button
//                         onClick={handleSubmit}
//                         className="px-6 py-3 bg-indigo-500 text-white rounded-xl shadow hover:bg-indigo-600 transition"
//                     >
//                         🚀 Submit Request
//                     </button>
//                 </div>
//             </motion.div>
//         </div>
//     );
// }
'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import L from "leaflet";

// Dynamically import Leaflet components (avoid SSR issues)
const MapContainer = dynamic(
    () => import("react-leaflet").then((m) => m.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import("react-leaflet").then((m) => m.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import("react-leaflet").then((m) => m.Marker),
    { ssr: false }
);

const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [30, 45],
    iconAnchor: [15, 45],
});

export default function ServiceRequestPage() {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [serviceType, setServiceType] = useState("Instant Service");
    const [serviceTime, setServiceTime] = useState("");
    const [issue, setIssue] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [location, setLocation] = useState<[number, number] | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    // Auto-fetch current location on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setLocation([pos.coords.latitude, pos.coords.longitude]);
            });
        }
    }, []);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        // Validate required fields
        if (!name || !serviceType || !serviceTime || !issue) {
            setMessage("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);
        setMessage("");

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', desc);
        formData.append('serviceType', serviceType);
        formData.append('serviceTime', serviceTime);
        formData.append('detailedIssue', issue);
        
        if (location) {
            formData.append('latitude', location[0].toString());
            formData.append('longitude', location[1].toString());
        }
        
        if (file) {
            formData.append('image', file);
        }

        try {
            const response = await fetch('/api/services', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                setMessage('✅ Service request submitted successfully!');
                // Reset form
                setName("");
                setDesc("");
                setServiceType("Instant Service");
                setServiceTime("");
                setIssue("");
                setFile(null);
            } else {
                setMessage(`❌ Error: ${result.error}`);
            }
        } catch (error) {
            setMessage('❌ Failed to submit service request');
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white p-6 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="w-full max-w-5xl bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        Service Request
                    </h1>
                    <button className="px-5 py-2 bg-white/20 text-white font-medium rounded-lg shadow hover:bg-white/30 transition">
                        Track Request
                    </button>
                </div>

                {/* Message Display */}
                {message && (
                    <div className={`mx-8 mt-4 p-3 rounded-lg ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                {/* Form + Map */}
                <div className="grid md:grid-cols-2 gap-8 p-8">
                    {/* Left side form */}
                    <div className="space-y-5">
                        <input
                            type="text"
                            placeholder="Your Name *"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                            required
                        />

                        <textarea
                            placeholder="Short Description"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            className="w-full p-3 rounded-xl border shadow-sm min-h-[80px] focus:ring-2 focus:ring-indigo-400 outline-none"
                        />

                        <select
                            value={serviceType}
                            onChange={(e) => setServiceType(e.target.value)}
                            className="w-full p-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                        >
                            <option>Instant Service</option>
                            <option>Pre Book Slot</option>
                            <option>Consultation</option>
                            <option>Emergency Service</option>
                        </select>

                        <input
                            type="datetime-local"
                            value={serviceTime}
                            onChange={(e) => setServiceTime(e.target.value)}
                            className="w-full p-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                            required
                        />

                        {/* File Upload */}
                        <div className="p-3 border-2 border-dashed rounded-xl text-center cursor-pointer hover:bg-gray-50">
                            <label className="block text-sm text-gray-600 mb-2">
                                📷 Upload an Image (Optional)
                            </label>
                            <input type="file" onChange={handleFile} className="text-sm" accept="image/*" />
                            {file && (
                                <p className="text-xs mt-1 text-gray-500">Selected: {file.name}</p>
                            )}
                        </div>

                        <textarea
                            placeholder="Detailed Issue *"
                            value={issue}
                            onChange={(e) => setIssue(e.target.value)}
                            className="w-full p-3 rounded-xl border shadow-sm min-h-[100px] focus:ring-2 focus:ring-indigo-400 outline-none"
                            required
                        />
                    </div>

                    {/* Right side Map */}
                    <div className="space-y-4">
                        <button
                            onClick={() => {
                                if (navigator.geolocation) {
                                    navigator.geolocation.getCurrentPosition((pos) =>
                                        setLocation([pos.coords.latitude, pos.coords.longitude])
                                    );
                                }
                            }}
                            className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition"
                        >
                            📍 Use My Current Location
                        </button>

                        <div className="rounded-xl overflow-hidden shadow-lg h-[350px]">
                            {location ? (
                                <MapContainer
                                    center={location}
                                    zoom={14}
                                    className="h-full w-full z-0"
                                >
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Marker
                                        position={location}
                                        icon={customIcon}
                                        draggable={true}
                                        eventHandlers={{
                                            dragend: (e) => {
                                                const marker = e.target;
                                                const newPos = marker.getLatLng();
                                                setLocation([newPos.lat, newPos.lng]);
                                            },
                                        }}
                                    />
                                </MapContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center bg-gray-100 text-gray-500">
                                    Click "Use My Current Location" to enable map
                                </div>
                            )}
                        </div>
                        
                        {location && (
                            <div className="text-xs text-gray-500 text-center">
                                Lat: {location[0].toFixed(6)}, Lng: {location[1].toFixed(6)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center p-6 border-t bg-gray-50">
                    <button className="px-6 py-3 bg-purple-500 text-white rounded-xl shadow hover:bg-purple-600 transition">
                        💬 Chat with Support
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-indigo-500 text-white rounded-xl shadow hover:bg-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                    >
                        {isSubmitting ? '⏳ Submitting...' : '🚀 Submit Request'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}