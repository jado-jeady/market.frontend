import { Outlet } from 'react-router-dom';
import SubMenu from '../../../components/SubMenu';

const Stock = () => {
  const subMenuItems = [
    {name : 'Stock', path:"/admin/stock"},
    { name: 'Stock In', path: '/admin/stock/in' },
    { name: 'Stock Out', path: '/admin/stock/out' },
    { name: 'Stock Reports', path: '/admin/stock/removed'},
  ];

  return (
    <div>
      <SubMenu items={subMenuItems} />
      <Outlet />
    </div>
  );
};

export default Stock;
