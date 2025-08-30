"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  // Add other user properties as needed
}

interface DashboardProps { }

// Remove token from localStorage
const removeUserFromStorage = () => {
  try {
    localStorage.removeItem('token');
  } catch (error) {
    console.error('Error removing token from localStorage:', error);
  }
};

const Dashboard: React.FC<DashboardProps> = () => {
  const [selectedStatus, setSelectedStatus] = useState('Status');
  const [selectedCategory, setSelectedCategory] = useState('Category');
  const [selectedDuration, setSelectedDuration] = useState('Duration');
  const [user, setUser] = useState<User | null>(null);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch requests (refactored for reuse)
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/services/getServices');
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
    router.push('/login');
  };

  // Handler to update status
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setLoading(true);
      await fetch('/api/services/getServices', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      await fetchRequests();
    } catch (err) {
      // Optionally show error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <button
        className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-sm transition-colors"
        onClick={() => router.push('/')}
      >Back</button>
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
              onClick={() => router.push('/dashboard/admin/home')}
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

        {/* Controls Row */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="show-open-only"
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
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

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Items:</span>
              <span className="text-sm">0</span>
              <span className="text-sm text-gray-400">Selected:</span>
              <span className="text-sm">0</span>
            </div>
          </div>
        </div>

        {/* Service Requests Table */}
        {/* <div className="mt-8">
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
                {serviceRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-400">No requests found.</td>
                  </tr>
                ) : (
                  serviceRequests.map((req) => (
                    <tr key={req.name}>
                      <td className="px-4 py-2 border">{req.name}</td>
                      <td className="px-4 py-2 border">{req.serviceType}</td>
                      <td className="px-4 py-2 border">{req.date ? new Date(req.date).toLocaleString() : ''}</td>
                      <td className="px-4 py-2 border">{req.detailedIssue}</td>
                      <td className="px-4 py-2 border">
                        <select
                          value={req.status}
                          onChange={e => handleStatusChange(req.name, e.target.value)}
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
        </div> */}
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
                {serviceRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-400">
                      No requests found.
                    </td>
                  </tr>
                ) : (
                  serviceRequests.map((req) => (
                    <tr key={req.id}>
                      <td className="px-4 py-2 border">{req.name}</td>
                      <td className="px-4 py-2 border">{req.serviceType}</td>
                      <td className="px-4 py-2 border">
                        {req.createdAt ? new Date(req.createdAt).toLocaleString() : ""}
                      </td>
                      <td className="px-4 py-2 border">{req.issue || req.detailedIssue}</td>
                      <td className="px-4 py-2 border">
                        <select
                          value={req.status ?? "OPEN"}  // status jo DB me hai usko dikhao
                          onChange={(e) => handleStatusChange(req.id, e.target.value)} // id use karna hai
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
    // </div >
  );
};

export default Dashboard;
