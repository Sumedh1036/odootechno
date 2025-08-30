"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
}

interface DashboardProps {}

const removeUserFromStorage = () => {
  try {
    localStorage.removeItem("token");
  } catch (error) {
    console.error("Error removing token from localStorage:", error);
  }
};

const Dashboard: React.FC<DashboardProps> = () => {
  const [selectedStatus, setSelectedStatus] = useState("Status");
  const [selectedCategory, setSelectedCategory] = useState("Category");
  const [selectedDuration, setSelectedDuration] = useState("Duration");
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services/getServices");
      const data = await res.json();
      setServiceRequests(data.requests || []);
    } catch {
      setServiceRequests([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleLogout = () => {
    removeUserFromStorage();
    router.push("/login");
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setLoading(true);
      await fetch("/api/services/getServices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      await fetchRequests();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter service requests
  const filteredRequests = serviceRequests.filter((req) => {
    let statusMatch = true;
    let categoryMatch = true;
    let durationMatch = true;
    let openOnlyMatch = true;

    if (selectedStatus !== "Status") {
      statusMatch = req.status === selectedStatus.toUpperCase();
    }

    if (selectedCategory !== "Category") {
      categoryMatch = req.category === selectedCategory;
    }

    if (selectedDuration !== "Duration") {
      const now = new Date();
      const createdAt = new Date(req.createdAt || req.date);
      if (selectedDuration === "Last 7 days") {
        durationMatch = now.getTime() - createdAt.getTime() <= 7 * 24 * 60 * 60 * 1000;
      } else if (selectedDuration === "Last 30 days") {
        durationMatch = now.getTime() - createdAt.getTime() <= 30 * 24 * 60 * 60 * 1000;
      } else if (selectedDuration === "Last 90 days") {
        durationMatch = now.getTime() - createdAt.getTime() <= 90 * 24 * 60 * 60 * 1000;
      }
    }

    if (showOpenOnly) {
      openOnlyMatch = req.status === "OPEN";
    }

    return statusMatch && categoryMatch && durationMatch && openOnlyMatch;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <button
        className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-sm transition-colors mb-4"
        onClick={() => router.push("/")}
      >
        Back
      </button>

      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg border border-gray-600 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-600">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm">Admin dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-sm transition-colors"
              onClick={() => router.push("/dashboard/admin/home")}
            >
              Add shop
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-sm transition-colors"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="show-open-only"
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              checked={showOpenOnly}
              onChange={(e) => setShowOpenOnly(e.target.checked)}
            />
            <label htmlFor="show-open-only" className="text-sm text-gray-300">
              Show open only
            </label>
          </div>

          <div className="flex gap-3 ml-auto">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Status</option>
              <option>Open</option>
              <option>Closed</option>
              <option>Pending</option>
              <option>In_Progress</option>
              <option>Completed</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Category</option>
              <option>Tax</option>
              <option>Legal</option>
              <option>Finance</option>
            </select>

            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Duration</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Service Requests Table */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Service Requests</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 border rounded">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Service Type</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Issue</th>
                  <th className="px-4 py-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-400">
                      No requests found.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr key={req.id}>
                      <td className="px-4 py-2 border">{req.name}</td>
                      <td className="px-4 py-2 border">{req.serviceType}</td>
                      <td className="px-4 py-2 border">
                        {req.createdAt ? new Date(req.createdAt).toLocaleString() : ""}
                      </td>
                      <td className="px-4 py-2 border">{req.issue || req.detailedIssue}</td>
                      <td className="px-4 py-2 border">
                        <select
                          value={req.status ?? "OPEN"}
                          onChange={(e) => handleStatusChange(req.id, e.target.value)}
                          className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                          disabled={loading}
                        >
                          <option value="OPEN">Open</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="PENDING">Pending</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CLOSED">Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
