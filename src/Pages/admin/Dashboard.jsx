import { useState, useEffect } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalStock: 0,
    lowStock: 0,
    totalUsers: 0
  });

  useEffect(() => {
    // Fetch dashboard statistics
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        // Demo data
        setStats({
          totalSales: 125430,
          totalStock: 3456,
          lowStock: 23,
          totalUsers: 45
        });
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Sales',
      value: `${stats.totalSales.toLocaleString()} Frw`,
      icon: '💵',
      color: 'from-green-500 to-green-600',
      change: '+12.5%'
    },
    {
      title: 'Total Stock',
      value: stats.totalStock.toLocaleString(),
      icon: '📦',
      color: 'from-blue-500 to-blue-600',
      change: '+5.2%'
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStock,
      icon: '⚠️',
      color: 'from-yellow-500 to-orange-600',
      change: '-3.1%'
    },
    {
      title: 'Total Customers',
      value: stats.totalUsers,
      icon: '👥',
      color: 'from-purple-500 to-purple-600',
      change: '+8.3%'
    }
  ];

  return (
    <div className="p-6">
      {/* Statistics Cards */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className={`bg-gradient-to-r ${card.color} p-4 text-white`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{card.icon}</span>
                <span className="text-sm text-gray-700 bg-white bg-opacity-30 px-2 py-1 rounded">
                  {card.change}
                </span>
              </div>
              <h3 className="text-sm font-medium opacity-90">{card.title}</h3>
              <p className="text-3xl font-bold mt-2">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart Placeholder */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Overview</h3>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded flex items-center justify-center text-gray-500">
            <p>Chart will be rendered here</p>
          </div>
        </div>

        {/* Stock Chart Placeholder */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Stock Levels</h3>
          <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded flex items-center justify-center text-gray-500">
            <p>Chart will be rendered here</p>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
        <div className="space-y-3">
          {[
            { action: 'New sale recorded', time: '5 minutes ago', type: 'sale' },
            { action: 'Stock updated for Product X', time: '15 minutes ago', type: 'stock' },
            { action: 'New user registered', time: '1 hour ago', type: 'user' },
            { action: 'Report generated', time: '2 hours ago', type: 'report' }
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'sale' ? 'bg-green-500' :
                  activity.type === 'stock' ? 'bg-blue-500' :
                  activity.type === 'user' ? 'bg-purple-500' :
                  'bg-orange-500'
                }`}></div>
                <span className="text-gray-700">{activity.action}</span>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
