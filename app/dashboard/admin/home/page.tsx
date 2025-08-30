"use client";
import React, { useState } from 'react';
import { Plus, Trash2, MapPin, Phone, Mail, User, Building, FileText, Settings, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [shopData, setShopData] = useState<{
    name: string;
    description: string;
    services: string[];
    location: { lat: string; lng: string };
    address: string;
    owner: string;
    phone: string;
    email: string;
  }>({
    name: '',
    description: '',
    services: [],
    location: { lat: '', lng: '' },
    address: '',
    owner: '',
    phone: '',
    email: ''
  });
  
  const [newService, setNewService] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    if (field === 'lat' || field === 'lng') {
      setShopData(prev => ({
        ...prev,
        location: { ...prev.location, [field]: value }
      }));
    } else {
      setShopData(prev => ({ ...prev, [field]: value }));
    }
  };

  const addService = () => {
    if (newService.trim() && !shopData.services.includes(newService.trim())) {
      setShopData(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()]
      }));
      setNewService('');
    }
  };

  const removeService = (serviceToRemove) => {
    setShopData(prev => ({
      ...prev,
      services: prev.services.filter(service => service !== serviceToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/shops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...shopData,
          location: {
            lat: parseFloat(shopData.location.lat) || 0,
            lng: parseFloat(shopData.location.lng) || 0
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create shop');
      }

      console.log('Shop created successfully:', data.shop);
      setSubmitSuccess(true);
      
      setTimeout(() => {
        setSubmitSuccess(false);
        // Reset form
        setShopData({
          name: '',
          description: '',
          services: [],
          location: { lat: '', lng: '' },
          address: '',
          owner: '',
          phone: '',
          email: ''
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error creating shop:', error);
      alert(`Failed to create shop: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return shopData.name && 
           shopData.description && 
           shopData.services.length > 0 && 
           shopData.address && 
           shopData.owner && 
           shopData.phone && 
           shopData.email &&
           shopData.location.lat &&
           shopData.location.lng;
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Shop Added Successfully!</h2>
          <p className="text-gray-600 mb-4">Your shop has been registered and is now live on the platform.</p>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h1 className="ml-4 text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="text-sm text-gray-500">
              Register Your Shop
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Add Your Shop</h2>
            <p className="text-indigo-100 mt-2">Fill in the details below to register your shop on the platform</p>
          </div>

          <div className="p-8 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Building className="w-5 h-5 mr-2 text-indigo-600" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shop Name *
                  </label>
                  <input
                    type="text"
                    value={shopData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Enter shop name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Owner Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={shopData.owner}
                      onChange={(e) => handleInputChange('owner', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter owner name"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <textarea
                    value={shopData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                    placeholder="Describe your shop and services..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Phone className="w-5 h-5 mr-2 text-indigo-600" />
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={shopData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="+1 555-555-5556"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={shopData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="info@yourshop.com"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
                Location Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={shopData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Enter full address"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={shopData.location.lat}
                    onChange={(e) => handleInputChange('lat', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="23.0225"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={shopData.location.lng}
                    onChange={(e) => handleInputChange('lng', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="72.5714"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Services Offered *</h3>
              
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addService();
                    }
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Add a service"
                />
                <button
                  type="button"
                  onClick={addService}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              
              {shopData.services.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Added Services:</p>
                  <div className="flex flex-wrap gap-2">
                    {shopData.services.map((service, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-800 rounded-lg text-sm"
                      >
                        {service}
                        <button
                          type="button"
                          onClick={() => removeService(service)}
                          className="text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid() || isSubmitting}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Registering Shop...
                  </div>
                ) : (
                  'Register Shop'
                )}
              </button>
              
              {!isFormValid() && (
                <p className="text-sm text-red-600 mt-2 text-center">
                  Please fill in all required fields to register your shop
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 