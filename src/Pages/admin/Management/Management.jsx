import React from "react";
import SubMenu from "../../../components/SubMenu";
import { Outlet } from "react-router-dom";

// Main Management Component with Horizontal Menu
const Management = () => {
  const subMenuItems = [
    
    { name: 'Manage Roles', path: '/admin/management/roles' },
    { name: 'Manage Users', path: '/admin/management/users' },
    { name: 'Manage Settings', path: '/admin/management/settings' },

  ];

  return (
    <div>
    <SubMenu items={subMenuItems}/>
    <Outlet/>
    </div>

  );
};

export default Management;
