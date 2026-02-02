import { Outlet } from 'react-router-dom';
import SubMenu from '../../components/SubMenu';

const UserProducts = () => {
  const subMenuItems = [
    { name: 'Product List', path: '/user/products' },
    { name: 'Add Product', path: '/user/products/add' },
    { name: 'Edit Product', path: '/user/products/edit' },
  ];

  return (
    <div>
      <SubMenu items={subMenuItems} />
      <Outlet />
    </div>
  );
};

export default UserProducts;
