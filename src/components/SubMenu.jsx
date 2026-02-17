import { NavLink } from 'react-router-dom';

const SubMenu = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className=" w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="px-3 py-1">
        <nav className="flex space-x-1 overflow-x-auto">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SubMenu;
