import { useState, useEffect } from 'react';

const ViewAll = () => {
  const [productions, setProductions] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchProductions = async () => {
      try {
        const response = await fetch('/api/storekeeper/productions');
        if (response.ok) {
          const data = await response.json();
          setProductions(data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchProductions();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Productions</h1>
          <p className="text-gray-600 mt-1">View all production records</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-md text-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Batch ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Items</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Total Quantity</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Date Added</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[...Array(8)].map((_, i) => {
              const statuses = ['pending', 'approved', 'rejected'];
              const status = statuses[i % 3];
              
              return (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">BATCH-{1000 + i}</td>
                  <td className="px-6 py-4 text-sm">
                    Sambusa, Mandazi, Chapati
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold">{Math.floor(Math.random() * 150 + 50)}</td>
                  <td className="px-6 py-4 text-sm">2024-01-30 08:{String(i * 5).padStart(2, '0')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAll;