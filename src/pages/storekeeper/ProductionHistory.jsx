const ProductionHistory = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Production History</h1>
        <p className="text-gray-600 mt-1">View all past production records</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          />
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
            <option>All Status</option>
            <option>Approved</option>
            <option>Rejected</option>
            <option>Pending</option>
          </select>
          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
            Apply Filter
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Batch #</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Date & Time</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Items</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Total Qty</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Approved By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[...Array(10)].map((_, i) => {
              const statuses = ['Approved', 'Rejected', 'Pending'];
              const status = statuses[i % 3];
              const statusColor = status === 'Approved' ? 'bg-green-100 text-green-700' : status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700';
              
              return (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">BATCH-{String(i + 1).padStart(3, '0')}</td>
                  <td className="px-6 py-4 text-sm">2024-01-{String(30 - i).padStart(2, '0')} 08:30</td>
                  <td className="px-6 py-4 text-sm">Sambusa, Mandazi</td>
                  <td className="px-6 py-4 text-sm font-semibold">{Math.floor(Math.random() * 100 + 50)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{status === 'Approved' ? 'Cashier 1' : status === 'Rejected' ? 'Cashier 2' : '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductionHistory;