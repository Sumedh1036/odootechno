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
  const router = useRouter();

  const handleLogout = () => {
    removeUserFromStorage();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg border border-gray-600 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-600">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm">Agent Tax Request</span>
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

        {/* Main Content Area */}
        {/* <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-8 text-center min-h-96 flex items-center justify-center">
          <div className="text-yellow-200">
            <h3 className="text-lg mb-2">Dash Board to display the Statistics</h3>
            <p className="text-sm opacity-80">of completed Service & Employee performance</p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
