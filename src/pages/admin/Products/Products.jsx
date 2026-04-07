import { Outlet } from "react-router-dom";
import SubMenu from "../../../components/SubMenu";

const Products = () => {
  const subMenuItems = [
    { name: "Add Product", path: "/admin/products/add" },
    { name: "Product List", path: "/admin/products/list" },
    { name: "Product Transfer", path: "/admin/products/transfer" },
    { name: "Product Categories", path: "/admin/products/category" },
  ];
  return (
    <div className="w-full sticky top-10 border-b border-gray-200 shadow-sm">
      <SubMenu items={subMenuItems} />
      <Outlet />
    </div>
  );
};

export default Products;
