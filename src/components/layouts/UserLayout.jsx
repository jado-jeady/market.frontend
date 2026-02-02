import { Outlet } from 'react-router-dom';
import UserSidebar from '../UserSidebar';
import Header from '../Header';

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <UserSidebar />
      <div className="ml-45">
        <div>
          <Header />
        </div>
        
        <main className="pt-16 pt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
