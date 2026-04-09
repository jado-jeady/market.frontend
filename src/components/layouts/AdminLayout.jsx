import { Outlet } from "react-router-dom";
import AdminSidebar from "../AdminSidebar";
import Header from "../Header";

const AdminLayout = () => {
  return (
    /* 
      1. overflow-hidden on the parent prevents the "side-scroll" ghosting.
      2. flex-row is only for larger screens where the sidebar is visible.
    */
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar - Ensure it's hidden on mobile or becomes a drawer */}
      <AdminSidebar />

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white lg:ml-40">
        {/* Header - Fixed or Sticky at the top */}
        <div className="w-full sticky top-20 z-30">
          <Header />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-2 pt-10 sm:p-4 md:pt-10 lg:pt-15 lg:p-6 bg-gray-50/30">
          {/* 
             min-w-0 on the container and overflow-x-hidden on the main 
             is CRITICAL to stop the page from expanding past the screen width.
          */}
          <div className="w-full max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
