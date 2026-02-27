import { Outlet } from 'react-router-dom';
import StorekeeperSidebar from '../StorekeeperSidebar';
import Header from '../Header';

const StorekeeperLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <StorekeeperSidebar />
      <div className="ml-40">
        <Header />
        <main className="pt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StorekeeperLayout;