const ManageRoles = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Roles</h1>
        <p className="text-gray-600 mt-1">Configure user roles and permissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: 'Admin', count: 2, color: 'purple', permissions: ['All Access'] },
          { name: 'Manager', count: 5, color: 'blue', permissions: ['Sales', 'Stock', 'Reports'] },
          { name: 'Cashier', count: 12, color: 'green', permissions: ['Sales', 'Customers'] }
        ].map((role, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className={`w-12 h-12 bg-${role.color}-100 rounded-lg flex items-center justify-center mb-4`}>
              <svg className={`w-6 h-6 text-${role.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{role.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{role.count} users</p>
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-700 mb-2">Permissions:</p>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((perm, j) => (
                  <span key={j} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {perm}
                  </span>
                ))}
              </div>
            </div>
            <button className="w-full py-2 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition font-medium">
              Edit Role
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageRoles;
