import { Outlet } from 'react-router-dom';
import SubMenu from '../../components/SubMenu';

const UserSales = () => {
  const subMenuItems = [
    { name: 'New Sale', path: '/user/sales/new' },
    { name: 'Returns', path: '/user/sales/returns' },
    { name: 'Refunds', path: '/user/sales/refunds' },
  ];

  return (
    <div>
      <SubMenu items={subMenuItems} />
      <Outlet />
    </div>
  );
};

export default UserSales;
