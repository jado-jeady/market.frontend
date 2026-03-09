import { Outlet } from 'react-router-dom';
import SubMenu from '../../components/SubMenu';

const UserCustomers = () => {
  const subMenuItems = [
    { name: 'Add Customer', path: '/user/customers/add' },
    { name: 'Loyalty Points', path: '/user/customers/loyalty' },
    { name: 'Search Customer', path: '/user/customers/search' },
  ];

  return (
    <div>
      <SubMenu items={subMenuItems} />
      <Outlet />
    </div>
  );
};

export default UserCustomers;
