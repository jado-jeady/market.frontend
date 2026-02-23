import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  BarChart3,
  CalendarCheck,
  Settings,
  Menu,
  X,
} from "lucide-react";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Sales", path: "/admin/sales", icon: ShoppingCart },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Stock", path: "/admin/stock", icon: Boxes },
    { name: "Report", path: "/admin/report", icon: BarChart3 },
    { name: "Day Close", path: "/admin/day-closing", icon: CalendarCheck },
    { name: "Management", path: "/admin/management", icon: Settings },
  ];

  return (
    <>
      {/* ================= TOGGLE BUTTON (hamburger) ================= */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 bg-white text-gray-700 p-2 rounded-md shadow-md"
      >
        <Menu size={20} />
      </button>

      {/* ================= OVERLAY ================= */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 bg-opacity-40 z-40 lg:hidden"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:w-40`}
      >
        {/* Close button (inside sidebar, mobile only) */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 lg:hidden p-2 rounded bg-secondary-600 text-white"
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div className="p-4 border-b border-red-300">
          <h3 className="text-lg text-gray-400 font-bold">POS Admin</h3>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? "bg-secondary-500 text-white shadow-md"
                          : "hover:bg-primary-600 text-primary-100"
                      }`
                    }
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-600 text-xs text-center text-gray-400">
          © 2026 POS System
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;