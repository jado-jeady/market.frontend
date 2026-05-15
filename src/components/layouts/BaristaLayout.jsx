import { useState } from "react";
import { Outlet } from "react-router-dom";
import BaristaSidebar from "../BaristaSidebar";
import Header from "../Header";

const BaristaLayout = () => {
  // define the state here
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="bg-white w-40 sticky top-0 border border-gray-200 shadow-lg h-15.5 flex flex-col justify-center px-5">
        <h2 className="text-base text-gray-800 font-black tracking-tight">
          TYGA BARISTA
        </h2>
        <p className="text-xs text-gray-600  font-semibold">
          Tablet Ordering System
        </p>
      </div>

      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="min-h-screen bg-gray-50 flex">
        {/* Content */}

        <div className="flex-1 flex flex-col  bg-white">
          <main className="pt-0 ml-0 md:ml-2">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default BaristaLayout;
