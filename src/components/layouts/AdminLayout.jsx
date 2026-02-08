import { Outlet } from 'react-router-dom';
import Sidebar from '../AdminSidebar';
import Header from '../Header';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-40">
        <Header />
        <main className="pt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
