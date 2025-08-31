"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
}

interface Shop {
  id: string;
  name: string;
}

interface ServiceRequest {
  id: string;
  name: string;
  serviceType: string;
  createdAt: string;
  detailedIssue: string;
  status: string;
  assignedMechanic?: User | null;
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
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<string>("");
  const [mechanics, setMechanics] = useState<User[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [selectedMechanic, setSelectedMechanic] = useState<string>("");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch shops for the admin
  const fetchShops = async () => {
    try {
      const res = await fetch("/api/shops", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setShops(data.shops || []);
      if (data.shops?.length > 0) {
        setSelectedShop(data.shops[0].id);
      }
    } catch (error) {
      console.error("Error fetching shops:", error);
      setShops([]);
    }
  };

  // Fetch mechanics for the selected shop
  const fetchMechanics = async (shopId: string) => {
    if (!shopId) return;
    try {
      const res = await fetch(`/api/shops/${shopId}/mechanics`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setMechanics(data.mechanics || []);
    } catch (error) {
      console.error("Error fetching mechanics:", error);
      setMechanics([]);
    }
  };

  // Fetch service requests
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/services/getServices?shopId=${selectedShop}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setServiceRequests(data.requests || []);
    } catch {
      setServiceRequests([]);
    }
    setLoading(false);
  };

  // Assign task to a mechanic
  const handleAssignTask = async () => {
    if (!selectedRequest || !selectedMechanic) return;
    try {
      setLoading(true);
      const res = await fetch("/api/tasks/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          adminId: 1, // Replace with actual admin ID from auth context or token
          serviceRequestId: selectedRequest.id,
          mechanicId: parseInt(selectedMechanic),
        }),
      });
      if (!res.ok) throw new Error("Failed to assign task");
      setIsTaskModalOpen(false);
      setSelectedMechanic("");
      await fetchRequests();
    } catch (error) {
      console.error("Error assigning task:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    if (selectedShop) {
      fetchMechanics(selectedShop);
      fetchRequests();
    }
  }, [selectedShop]);

  const handleLogout = () => {
    removeUserFromStorage();
    router.push("/login");
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setLoading(true);
      await fetch("/api/services/getServices", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id, status: newStatus }),
      });
      await fetchRequests();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAssignTaskModal = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setIsTaskModalOpen(true);
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
      categoryMatch = req.serviceType === selectedCategory; // Updated to use serviceType
    }

    if (selectedDuration !== "Duration") {
      const now = new Date();
      const createdAt = new Date(req.createdAt);
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
              <option>In_Progress</option>
              <option>Pending</option>
              <option>Completed</option>
              <option>Closed</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Category</option>
              {/* Populate dynamically based on ShopService names if needed */}
              <option>Oil Change</option>
              <option>Tire Repair</option>
              <option>Brake Service</option>
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

        {/* Shop Selection */}
        {shops.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Shop
            </label>
            <select
              value={selectedShop}
              onChange={(e) => setSelectedShop(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a shop</option>
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name}
                </option>
              ))}
            </select>
          </div>
        )}

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
                  <th className="px-4 py-2 border">Assigned Mechanic</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-400">
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
                      <td className="px-4 py-2 border">{req.detailedIssue}</td>
                      <td className="px-4 py-2 border">
                        {req.assignedMechanic ? req.assignedMechanic.name : "Unassigned"}
                      </td>
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
                      <td className="px-4 py-2 border">
                        <button
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors"
                          onClick={() => openAssignTaskModal(req)}
                          disabled={loading || !selectedShop}
                        >
                          Assign Task
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assign Task Modal */}
        {isTaskModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Assign Task</h3>
              <p className="text-sm text-gray-300 mb-4">
                Assigning task: {selectedRequest?.name} ({selectedRequest?.serviceType})
              </p>
              <select
                value={selectedMechanic}
                onChange={(e) => setSelectedMechanic(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm mb-4"
              >
                <option value="">Select a mechanic</option>
                {mechanics.map((mechanic) => (
                  <option key={mechanic.id} value={mechanic.id}>
                    {mechanic.name}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-sm"
                  onClick={() => {
                    setIsTaskModalOpen(false);
                    setSelectedMechanic("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
                  onClick={handleAssignTask}
                  disabled={loading || !selectedMechanic}
                >
                  {loading ? "Assigning..." : "Assign"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;