import { useState } from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "../UserSidebar";
import Header from "../Header";

const UserLayout = () => {
  // define the state here
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar gets both props */}
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content */}
      <div className="flex-1 flex flex-col mt-15 bg-white md:ml-30">
        <Header />
        <main className="pt-0 ml-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;