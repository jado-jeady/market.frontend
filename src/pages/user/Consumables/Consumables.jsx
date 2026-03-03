import { Outlet } from 'react-router-dom';
import SubMenu from '../../../components/SubMenu';

const Consumables = () => {
  const subMenuItems = [
    
    { name: 'View All', path: '/user/consumables/all'},
    { name: 'Approved', path: '/user/consumables/approved' },
    { name: 'Pending Approval', path: '/user/consumables/pending'}
  ];

  return (
    <div>
      <SubMenu items={subMenuItems} />
      <Outlet />
    </div>
  );
};

export default Consumables;
