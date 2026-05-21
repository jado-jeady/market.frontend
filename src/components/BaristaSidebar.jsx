import React, { useEffect, useRef } from "react";
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
  LogOutIcon,
} from "lucide-react";

export default function BaristaSidebar({ sidebarOpen, setSidebarOpen }) {
  const dropdownRef = useRef(null);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/barista/dashboard",
      icon: <LayoutDashboard size={13} />,
    },
    {
      name: "Sells",
      path: "/barista/Sell",
      icon: <ShoppingCart size={13} />,
    },
    { name: "Sales", path: "/barista/sales", icon: <ShoppingCart size={13} /> },
    {
      name: "Menus",
      path: "/barista/menus",
      icon: <Package size={13} />,
    },
    {
      name: "Reporting",
      path: "/barista/reports",
      icon: <BarChart3 size={13} />,
    },
    {
      name: "Customers",
      path: "/barista/customers",
      icon: <Users size={13} />,
    },
    {
      name: "Day Closing",
      path: "/barista/day-closing",
      icon: <CalendarCheck size={13} />,
    },
    {
      name: "Settings",
      path: "/barista/settings",
      icon: <Settings size={13} />,
    },
    {
      name: "Logout",
      path: "/barista/logout",
      icon: <LogOutIcon size={13} />,
    },
  ];

  // Close when clicking outside of the dropdown container area
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        // Delay slightly if clicking the main trigger button to prevent instant retoggle
        if (!e.target.closest(".hamburger-trigger")) {
          setSidebarOpen(false);
        }
      }
    };
    if (sidebarOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen, setSidebarOpen]);

  if (!sidebarOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-9 left-0 w-52 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
    >
      {/* Mini Brand Label */}
      <div className="px-3 pt-3 pb-1 flex items-center justify-between border-b border-gray-50">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
          POS Navigation
        </p>
        <span className="text-[8px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-md">
          Barista Panel
        </span>
      </div>

      {/* Pop-up Navigation Menu */}
      <nav className="p-1.5 max-h-[70vh] overflow-y-auto space-y-0.5">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold transition-colors text-[11px] ${
                isActive
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <span className="shrink-0">{item.icon}</span>
            <span className="truncate">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Pop-up Metadata Footer */}
      <div className="p-2 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center text-[9px] text-gray-400 px-3">
        <span>© POS System</span>
        <span>v1.2.0</span>
      </div>
    </div>
  );
}
