import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaLock, FaBell, FaShieldAlt } from 'react-icons/fa';

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Account Settings */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaUser className="mr-2" /> Account Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-600">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-gray-600">{user?.name}</p>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaLock className="mr-2" /> Security
            </h2>
            <div className="space-y-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Change Password
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 ml-4">
                Enable Two-Factor Authentication
              </button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaBell className="mr-2" /> Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="email-notifications"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700">
                  Email Notifications
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="order-updates"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="order-updates" className="ml-2 block text-sm text-gray-700">
                  Order Updates
                </label>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaShieldAlt className="mr-2" /> Privacy
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="data-collection"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="data-collection" className="ml-2 block text-sm text-gray-700">
                  Allow Data Collection
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="marketing-emails"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="marketing-emails" className="ml-2 block text-sm text-gray-700">
                  Receive Marketing Emails
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;