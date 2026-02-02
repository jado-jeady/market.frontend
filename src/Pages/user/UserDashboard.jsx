import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// quickLinks.js or inside your component file
const quickLinks = [
  {
    id: 1,
    label: "New Sale",
    type: "link",
    href: "/user/sales/new",
    icon: (
      <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
  },
  {
    id: 2,
    label: "Add Product",
    type: "link",
    href: "/user/products/new",
    icon: (
      <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    id: 3,
    label: "Add Customer",
    type: "link",
    href: "/user/customers/new",
    classes:"",
    icon: (
      <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 4,
    label: "View Reports",
    type: "link",
    href: "/user/reports",
    icon: (<svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];


const UserDashboard = () => {
  const [stats, setStats] = useState({
    todaySales: 0,
    totalTransactions: 0,
    lowStockItems: 0,
    pendingReturns: 0,
  });

  

  const [transactionPrices] = useState(() =>
    Array.from({ length: 5 }, () => (Math.random() * 200 + 10).toFixed(2))
  );
  const [stockLevels] = useState(() =>
    Array.from({ length: 3 }, () => Math.floor(Math.random() * 5 + 1))
  );

  useEffect(() => {
    // Empty dependency array - effect is removed as it only set static data
  }, []);

  useEffect(() => {
    // Fetch user dashboard stats
    const fetchStats = async () => {
      try {
        // TODO: Replace with your actual API endpoint
        const response = await fetch('/api/user/dashboard/stats');
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
      title: "Today's Sales",
      value: `${stats.todaySales.toLocaleString()} frw`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Transactions',
      value: stats.totalTransactions.toLocaleString(),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Pending Returns',
      value: stats.pendingReturns,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="p-4 pt-2">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">User Dashboard</h3>
        <p className="text-gray-600 text-xs mt-1">Welcome! Here's your sales overview for today.</p>
      </div>

      {/* Stats Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
  {statCards.map((stat, index) => (
    <div
      key={index}
      className="bg-white flex flex-col items-center rounded-lg shadow-md hover:shadow-lg transition-shadow p-3"
    >
      {/* UPDATED ICON CONTAINER: Added flex, mx-auto, justify-center, items-center */}
      <div className={`flex mx-auto justify-center items-center p-1 rounded-lg bg-gradient-to-br ${stat.color} text-white mb-1`}>
        <i className="text-white  text-center">{stat.icon}</i>
      </div>
      <h3 className="text-gray-600 text-xs text-center font-medium">{stat.title}</h3>
      <p className="text-xs font-bold text-center text-gray-900 mt-1">{stat.value}</p>
    </div>
  ))}
</div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
      
          {quickLinks.map((action) =>
            action.type === "link" ? (
              <Link key={action.id} to={action.href} className="p-4 bg-white border-2 border-secondary-500 text-secondary-600 rounded-lg hover:bg-secondary-50 transition flex flex-col items-center text-blue-300 justify-center">
                {action.icon}
                <span className="font-medium text-xs text-blue-300">{action.label}</span>
              </Link>
            ) : (
              <button key={action.id} className={action.classes}>
                {action.icon}
                <span className="font-medium text-blue-300">{action.label}</span>
              </button>
            )
          )}
        </div>
      </div>
      

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-md p-3">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Recent Transactions</h2>
          <div className="space-y-1">
            {[1, 2, 3, 4, 5].map((transaction, index) => (
              <div key={transaction} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center text-[0.625rem] space-x-2">
                  <div className="w-10 text-[0.625rem] bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-gray-500 font-semibold text-sm">
                    TXN
                  </div>
                  <div>
                    <p className="font-medium text-[0.625rem] text-gray-900">Transaction #{2000 + transaction}</p>
                    <p className="text-xs text-gray-500">{transaction} mins ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[0.625rem] text-green-600">${transactionPrices[index]}</p>
                </div>
              </div>
            ))}
          </div>
          
        </div>
        
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Low Stock Alerts</h2>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            {stats.lowStockItems} Items
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Current Stock</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Min Required</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[1, 2, 3].map((item, index) => (
                <tr key={item} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">Product Name {item}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="text-red-600 font-semibold">{stockLevels[index]}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">10</td>
                  <td className="px-4 py-3 text-sm">
                    <button className="text-primary-600 hover:text-primary-700 font-medium">Restock</button>
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

export default UserDashboard;
