import { Outlet } from "react-router-dom";
import StorekeeperSidebar from "../StorekeeperSidebar.jsx";
import Header from "../Header";

const StorekeeperLayout = () => {
  return (
    <div className="flex h-screen ">
      <StorekeeperSidebar />
      <div className="">
        <Header />
      </div>
      <div className="top-20 pt-20 pl-40">
         <Outlet />
      </div>
    </div>
  );
};

export default StorekeeperLayout;
