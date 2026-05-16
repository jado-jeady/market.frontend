import { Outlet } from "react-router-dom";
import SubMenu from "../../../components/SubMenu";

const Stock = () => {
  const subMenuItems = [
    { name: "Stock", path: "/admin/stock" },
    { name: "Stock In", path: "/admin/stock/in" },
    { name: "Damage Management", path: "/admin/stock/damages" },
    { name: "Stock Adjustment", path: "/admin/stock/adjustment" },
  ];

  return (
    <div>
      <SubMenu items={subMenuItems} />
      <Outlet />
    </div>
  );
};

export default Stock;
