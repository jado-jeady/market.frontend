import { Outlet } from "react-router-dom";
import SubMenu from "../../../components/SubMenu";

const Barista = () => {
  const subMenuItems = [
    { name: "Dashboard", path: "/admin/barista/dashboard" },
    { name: "Sales", path: "/admin/barista/sales" },
    { name: "Manu Management", path: "/admin/barista/menus" },
    { name: "Controller Dashboard", path: "/admin/stock/adjustment" },
  ];

  return (
    <div>
      <SubMenu items={subMenuItems} />
      <Outlet />
    </div>
  );
};

export default Barista;
