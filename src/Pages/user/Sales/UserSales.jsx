import { Outlet } from 'react-router-dom';
import SubMenu from '../../../components/SubMenu';

const UserSales = () => {
  const subMenuItems = [
    { name: 'New Sale', path: '/user/sales/new' },
    { name: 'All Sale', path: '/user/sales/all' },
    { name: 'Returns', path: '/user/sales/returns' },
  ];

  return (
    <div className=''>
      <SubMenu items={subMenuItems} />
      <Outlet />
    </div>
  );
};

export default UserSales;
