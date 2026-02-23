import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  BarChart3,
  Users,
  CalendarCheck,
  Settings,
  Menu,
  X
} from "lucide-react";

const UserSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const menuItems = [
    { name: "Dashboard", path: "/user/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Sales", path: "/user/sales", icon: <ShoppingCart size={18} /> },
    { name: "Products", path: "/user/products", icon: <Package size={18} /> },
    { name: "Stock", path: "/user/stock", icon: <Boxes size={18} /> },
    { name: "Reports", path: "/user/reports", icon: <BarChart3 size={18} /> },
    { name: "Customers", path: "/user/customers", icon: <Users size={18} /> },
    { name: "Day Closing", path: "/user/day-closing", icon: <CalendarCheck size={18} /> },
    { name: "Settings", path: "/user/settings", icon: <Settings size={18} /> },
  ];

  return (
    <>
      {/* Mobile hamburger toggle (top-left, outside sidebar) */}
      <button
        className="fixed top-3 left-3 z-50 md:hidden p-2 rounded bg-gray-600 text-white"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/50 bg-opacity-10 bg-opacity-50 z-40 md:hidden transition-opacity ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white text-white shadow-xl transform transition-transform z-50
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:w-40`}
      >
        {/* Close button (absolute top-right inside sidebar) */}
        <button
          className="absolute top-3 right-3 md:hidden p-2 rounded bg-secondary-600 text-white"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div className="p-3 border-b shadow-sm border-secondary-600">
          <div className="flex items-center space-x-3">
            <div className="w-25 h-20 bg-gray-300 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-[#E50619]" />
            </div>
            <div>
              <h3 className="text-lg text-gray-700 font-bold">POS System</h3>
              <p className="text-xs text-red-400">Cashier Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="pb-3 py-2">
          <ul className="space-y-0">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gray-100 text-white transform scale-105"
                        : "text-secondary-100 hover:bg-secondary-600 hover:text-white"
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-600">
          <div className="text-xs text-gray-500 text-center">
            <p>© 2024 POS System</p>
            <p className="mt-1">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSidebar;