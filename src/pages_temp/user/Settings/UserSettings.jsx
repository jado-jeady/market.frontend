import { Outlet } from 'react-router-dom';
import SubMenu from '../../../components/SubMenu';

const UserSettings = () => {
  const subMenuItems = [
    { name: 'Tax Settings', path: '/user/settings/tax' },
    { name: 'Currency', path: '/user/settings/currency' },
    { name: 'Receipt Format', path: '/user/settings/receipt' },
  ];

  return (
    <div className=''>
      <SubMenu items={subMenuItems} />
      <Outlet />
    </div>
  );
};

export default UserSettings;
