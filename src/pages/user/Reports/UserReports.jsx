import { Outlet } from 'react-router-dom';
import SubMenu from '../../../components/SubMenu';

const UserReports = () => {
  const subMenuItems = [
    { name: 'Daily Sales', path: '/user/reports/daily-sales' },
    { name: 'Transaction History', path: '/user/reports/transactions' },
    { name: 'Expenses', path: '/user/reports/expenses' },
  ];

  return (
    <>
    <div className='w-full sticky top-0 bg-white border-b border-gray-200 shadow-sm'>
      <SubMenu items={subMenuItems} />
      </div>
    <div className=''>
      <Outlet />
    </div>
    </>
  );
};

export default UserReports;
