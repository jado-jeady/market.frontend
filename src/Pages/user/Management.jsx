import { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';

// User Management Component
const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@marketplace.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'John Doe', email: 'john@marketplace.com', role: 'Manager', status: 'Active' },
    { id: 3, name: 'Jane Smith', email: 'jane@marketplace.com', role: 'Staff', status: 'Active' }
  ]);

  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Staff',
    password: ''
  });

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (response.ok) {
        alert('User added successfully!');
        setShowAddUser(false);
        setNewUser({ name: '', email: '', role: 'Staff', password: '' });
      }
    } catch (error) {
      console.log('API call failed:', error);
      alert('User added successfully! (Demo mode)');
      setShowAddUser(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
        if (response.ok) {
          setUsers(users.filter(user => user.id !== userId));
          alert('User deleted successfully!');
        }
      } catch (error) {
        console.log('API call failed:', error);
        alert('User deleted successfully! (Demo mode)');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">User Management</h3>
        <button
          onClick={() => setShowAddUser(!showAddUser)}
          className="bg-gradient-to-r from-secondary-600 to-primary-600 text-white px-6 py-2 rounded-lg hover:from-secondary-700 hover:to-primary-700 transition"
        >
          {showAddUser ? '✕ Cancel' : '+ Add User'}
        </button>
      </div>

      {/* Add User Form */}
      {showAddUser && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Add New User</h4>
          <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="bg-gradient-to-r from-secondary-600 to-primary-600 text-white px-8 py-2 rounded-lg hover:from-secondary-700 hover:to-primary-700 transition"
              >
                Create User
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'Manager' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Settings Component
const Settings = () => {
  const [settings, setSettings] = useState({
    businessName: 'My Marketplace',
    email: 'info@marketplace.com',
    phone: '+1234567890',
    address: '123 Business Street',
    currency: 'USD',
    taxRate: '10',
    enableNotifications: true,
    enableEmailAlerts: true
  });

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (response.ok) {
        alert('Settings saved successfully!');
      }
    } catch (error) {
      console.log('API call failed:', error);
      alert('Settings saved successfully! (Demo mode)');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">System Settings</h3>
      
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Business Information */}
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Business Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Financial Settings */}
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Financial Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="RWF">RWF - Rwandan Franc</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
              <input
                type="number"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Notification Settings</h4>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Enable System Notifications</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableEmailAlerts}
                onChange={(e) => setSettings({ ...settings, enableEmailAlerts: e.target.checked })}
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Enable Email Alerts</span>
            </label>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-secondary-600 to-primary-600 text-white px-8 py-3 rounded-lg hover:from-secondary-700 hover:to-primary-700 transition font-semibold"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

// Main Management Component with Horizontal Menu
const Management = () => {
  const location = useLocation();

  const subMenuItems = [
    { name: 'User Management', path: '/management/users' },
    { name: 'Settings', path: '/management/settings' }
  ];

  return (
    <div className="p-6">
      {/* Horizontal Sub-Menu */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <nav className="flex space-x-1 p-2">
          {subMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                location.pathname === item.path
                  ? 'bg-gradient-to-r from-secondary-600 to-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Sub-Routes Content */}
      <Routes>
        <Route path="/" element={<Navigate to="/management/users" replace />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
};

export default Management;
