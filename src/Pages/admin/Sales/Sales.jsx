import { Outlet } from 'react-router-dom';
import SubMenu from '../../../components/SubMenu';

const Sales = () => {
  const subMenuItems = [
    {name : 'All Sales', path:"/admin/sales/all"},
    { name: 'Daily Sales', path: '/admin/sales/daily' },
    { name: 'Weekly Sales', path: '/admin/sales/weekly' },
    { name: 'Sales Claim', path: '/admin/sales/claim'},
    { name: 'Item Sales', path: '/admin/sales/items'},
  ];

  return (
    <div>
      <SubMenu items={subMenuItems} />
      <Outlet />
    </div>
  );
};

export default Sales;
