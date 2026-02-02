import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Sales', path: '/admin/sales', icon: '💰' },
    { name: 'Stock', path: '/admin/stock', icon: '📦' },
    { name: 'Report', path: '/admin/report', icon: '📈' },
    { name: 'Management', path: '/admin/management', icon: '⚙️' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-secondary-700 to-secondary-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-secondary-600">
          {isSidebarOpen && (
            <h2 className="text-xl font-bold">Marketplace</h2>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white hover:bg-secondary-600 p-2 rounded transition"
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                location.pathname.startsWith(item.path)
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-200 hover:bg-secondary-600'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              {isSidebarOpen && <span className="font-medium">{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-secondary-600">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            {isSidebarOpen && (
              <div>
                <p className="font-medium">Admin User</p>
                <p className="text-xs text-gray-300">Administrator</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition flex items-center justify-center space-x-2"
          >
            <span>🚪</span>
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            {menuItems.find(item => location.pathname.startsWith(item.path))?.name || 'Dashboard'}
          </h1>
          <div className="flex items-center space-x-4">
            <button className="relative text-gray-600 hover:text-gray-800">
              <span className="text-2xl">🔔</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
