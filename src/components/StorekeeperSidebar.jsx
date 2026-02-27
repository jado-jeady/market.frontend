import { LayoutDashboard,Boxes,BarChart3,Menu, } from "lucide-react";
import { Link } from "react-router-dom";

const StorekeeperSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const menuItems = [
    { name: "Dashboard", path: "/storekeeper/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Stock", path: "/storekeeper/stock", icon: <Boxes size={18} /> },
    { name: "Reports", path: "/storekeeper/reports", icon: <BarChart3 size={18} /> },
  ];

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-white text-white shadow-xl transform transition-transform z-50
      md:translate-x-0 md:w-40"
    >
      <button className="absolute top-3 right-3 md:hidden p-2 rounded bg-secondary-600 text-white"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu size={20} />
      </button>

      <div className="mt-16">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="flex items-center px-4 py-2 hover:bg-gray-200 hover:text-gray-900"
          >
            {item.icon}
            <span className="ml-4">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StorekeeperSidebar;