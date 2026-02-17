import { Outlet } from 'react-router-dom';
import SubMenu from '../../../components/SubMenu';

const Sales = () => {
  const subMenuItems = [
    {name : 'All Sales', path:"/admin/sales/all"},
    { name: 'Daily Sales', path: '/admin/sales/daily' },
    { name: 'Monthly Sales', path: '/admin/sales/monthly' },
    { name: 'Sales Claim', path: '/admin/sales/claim'},
  ];

  return (
    <div>
      <SubMenu items={subMenuItems} />
      <Outlet />
    </div>
  );
};

export default Sales;
