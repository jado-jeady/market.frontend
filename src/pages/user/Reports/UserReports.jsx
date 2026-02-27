import { Outlet } from 'react-router-dom';
import SubMenu from '../../../components/SubMenu';

const UserReports = () => {
  const subMenuItems = [
    { name: 'Daily Sales', path: '/user/reports/daily-sales' },
    { name: 'Transaction History', path: '/user/reports/transactions' },
    { name: 'Expenses', path: '/user/reports/expenses' },
  ];

  return (
    <div>
      <SubMenu items={subMenuItems} />
      <Outlet />
    </div>
  );
};

export default UserReports;
