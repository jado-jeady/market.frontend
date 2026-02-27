import { Outlet } from 'react-router-dom';
import SubMenu from '../../components/SubMenu';

const StorekeeperReports = () => {
  const subMenuItems = [
    { name: 'Daily Production', path: '/storekeeper/reports/daily' },
    { name: 'Consumption Report', path: '/storekeeper/reports/consumption' },
  ];

  return (
    <div>
      <SubMenu items={subMenuItems} />
      <Outlet />
    </div>
  );
};

export default StorekeeperReports;