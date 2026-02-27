import { Outlet } from 'react-router-dom';
import SubMenu from '../../../components/SubMenu';

const Consumables = () => {
  const subMenuItems = [
    { name: 'Add Production', path: '/storekeeper/consumables/add' },
    { name: 'View All', path: '/storekeeper/consumables/view' },
    { name: 'Pending Approval', path: '/storekeeper/consumables/pending' },
    { name: 'Approved', path: '/storekeeper/consumables/approved' },
  ];

  return (
    <div>
      <SubMenu items={subMenuItems} />
      <Outlet />
    </div>
  );
};

export default Consumables;