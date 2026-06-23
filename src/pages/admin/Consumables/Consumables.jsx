import { Outlet } from "react-router-dom";
import SubMenu from "../../../components/SubMenu";

const Consumables = () => {
  const subMenuItems = [
    { name: "Dashboard", path: "/admin/consumables/dashboard" },
    { name: "Add Production", path: "/admin/consumables/add" },
    { name: "Production Log", path: "/admin/consumables/log" },
  ];

  return (
    <div>
      <SubMenu items={subMenuItems} />
      <Outlet />
    </div>
  );
};

export default Consumables;
