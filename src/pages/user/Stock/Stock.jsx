import { Outlet } from "react-router-dom";
import SubMenu from "../../../components/SubMenu";

const UserSales = () => {
  const subMenuItems = [
    { name: "products", path: "/user/stock/products" },
    { name: "Expesses", path: "/user/stock/expenses" },
    { name: "Returns", path: "/user/stock/returns" },
  ];

  return (
    <div className="">
      <SubMenu items={subMenuItems} />
      <Outlet />
    </div>
  );
};

export default UserSales;
