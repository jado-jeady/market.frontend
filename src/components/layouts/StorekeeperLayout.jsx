import { Outlet } from "react-router-dom";
import StorekeeperSidebar from "../StorekeeperSidebar";
import Header from "../Header";
import { useState } from "react";

const StorekeeperLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <StorekeeperSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-56 md:ml-35" : "ml-0 md:ml-34"
        }`}
      >
        <Header />
        <main className="pt-12 md:pt-15 px-0 md:px-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StorekeeperLayout;