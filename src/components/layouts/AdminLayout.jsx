import { Outlet } from "react-router-dom";
import AdminSidebar from "../AdminSidebar";
import Header from "../Header";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Content Area */}
      <div className="flex-1 flex flex-col bg-white lg:ml-40">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 pt-16 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;