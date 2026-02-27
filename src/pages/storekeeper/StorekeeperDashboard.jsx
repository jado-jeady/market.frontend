import { useState, useEffect } from 'react';

const StorekeeperDashboard = () => {
  const [stats, setStats] = useState({
    totalProduced: 0,
    pendingApproval: 0,
    approvedToday: 0,
    expiringSoon: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // TODO: Replace with your actual API endpoint
        const response = await fetch('/api/storekeeper/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Produced Today',
      value: stats.totalProduced,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Pending Approval',
      value: stats.pendingApproval,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Approved Today',
      value: stats.approvedToday,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Expiring Soon',
      value: stats.expiringSoon,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  const consumables = [
    { name: 'Sambusa', stock: 45, target: 100, status: 'Low' },
    { name: 'Mandazi', stock: 80, target: 150, status: 'Good' },
    { name: 'Sausages', stock: 15, target: 50, status: 'Critical' },
    { name: 'Chapati', stock: 90, target: 100, status: 'Good' },
    { name: 'Breads', stock: 25, target: 80, status: 'Low' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Storekeeper Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage daily consumable production and inventory</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white mb-4`}>
              {stat.icon}
            </div>
            <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition shadow-md flex flex-col items-center justify-center">
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="font-medium">Add Production</span>
            </button>
            <button className="p-4 bg-white border-2 border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition flex flex-col items-center justify-center">
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="font-medium">View Pending</span>
            </button>
            <button className="p-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex flex-col items-center justify-center">
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="font-medium">View Reports</span>
            </button>
            <button className="p-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex flex-col items-center justify-center">
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">Daily Log</span>
            </button>
          </div>
        </div>

        {/* Current Stock Levels */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Current Stock Levels</h2>
          <div className="space-y-4">
            {consumables.map((item, index) => {
              const percentage = (item.stock / item.target) * 100;
              const statusColor = 
                item.status === 'Critical' ? 'text-red-600' :
                item.status === 'Low' ? 'text-yellow-600' : 'text-green-600';
              const barColor = 
                item.status === 'Critical' ? 'bg-red-500' :
                item.status === 'Low' ? 'bg-yellow-500' : 'bg-green-500';

              return (
                <div key={index} className="border-b border-gray-100 pb-3 last:border-0">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-medium text-gray-900">{item.name}</span>
                      <span className={`text-xs ml-2 font-semibold ${statusColor}`}>
                        {item.status}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">{item.stock}/{item.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${barColor} h-2 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Production (Pending Approval)</h2>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            {stats.pendingApproval} Pending
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Item</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Time Added</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Expires</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[1, 2, 3, 4].map((item) => (
                <tr key={item} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {['Sambusa', 'Mandazi', 'Chapati', 'Breads'][item % 4]}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {Math.floor(Math.random() * 50 + 20)} pieces
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {item} hour{item > 1 ? 's' : ''} ago
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    Today 6:00 PM
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                      Pending
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StorekeeperDashboard;