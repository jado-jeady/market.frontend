import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  Package,
  ClipboardList,
  BarChart3,
  Menu,
  X,
  Warehouse,
} from "lucide-react";

const StorekeeperSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/storekeeper/dashboard",
      icon: <LayoutDashboard size={14} />,
    },
    {
      name: "Consumables",
      path: "/storekeeper/consumables",
      icon: <Boxes size={14} />,
    },
    {
      name: "Production Log",
      path: "/storekeeper/production",
      icon: <ClipboardList size={14} />,
    },
    {
      name: "Inventory",
      path: "/storekeeper/inventory",
      icon: <Package size={14} />,
    },
    {
      name: "Reports",
      path: "/storekeeper/reports",
      icon: <BarChart3 size={14} />,
    },
  ];

  return (
    <>
      {/* Mobile hamburger toggle */}
      <button
        className="fixed top-2 left-3 z-50 md:hidden p-2 rounded bg-gray-600 text-white"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform z-50
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:w-40`}
      >
        {/* Close button (mobile only) */}
        <button
          className="absolute top-3 right-3 md:hidden p-2 rounded bg-red-600 text-white"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div className="p-0 border-b shadow-sm border-gray-200">
          <div className="flex px-0 py-2 items-center space-x-1">
            <div className="w-12 h-12 p-0 bg-gray-200 rounded-lg flex items-center justify-center">
              <Warehouse className=" w-full text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg text-gray-700 font-bold">Tyga Shop</h3>
              <p className="text-xs text-red-400">Storekeeper Panel</p>
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
                    `flex items-center space-x-2 px-2 py-3 text-xs rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gray-100 text-gray-800 transform scale-105"
                        : "text-gray-600 hover:bg-orange-100 hover:text-orange-700"
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
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            <p>© 2026 Marketplace</p>
            <p className="mt-1">Storekeeper Panel</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default StorekeeperSidebar;
