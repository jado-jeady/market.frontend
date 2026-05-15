import { useState } from "react";
import { Outlet } from "react-router-dom";
import BaristaSidebar from "../BaristaSidebar";
import Header from "../Header";

const BaristaLayout = () => {
  // define the state here
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Content */}
      <div className="flex-1 flex flex-col  bg-white">
        <main className="pt-0 ml-0 md:ml-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BaristaLayout;
