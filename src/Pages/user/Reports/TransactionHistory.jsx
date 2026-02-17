const TransactionHistory = () => {
  return (
    <div className="p-6">
      <div className="mb-2">
        <h3 className="text-xl font-bold text-gray-900">Transaction History</h3>
        <p className="text-gray-600 text-xs mt-1">View all past transactions</p>
      </div>

      {/* Filters */}
      <div className=" rounded-lg shadow-md p-1 mb-2">
        <div className="grid grid-cols-1 text-gray-500 text-xs md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search products..."
            className="px-2 h-7 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
          <select className="px-2 py-1 border h-7 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none">
            <option>All Categories</option>
            <option>Old</option>
            <option>Newer</option>
            <option>Pending</option>
          </select>
          <input type="date" className="px-2 py-1 h-7 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
          <button className="px-2 py-1 h-7 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            Reset Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r text-gray-500 from-primary-600 to-secondary-600 ">
            <tr>
              <th className="px-2 py-2 text-left font-semibold">ID</th>
              <th className="px-2 py-2 text-left font-semibold">Date & Time</th>
              <th className="px-2 py-2 text-left font-semibold">Customer</th>
              <th className="px-2 py-2 text-left font-semibold">Amount</th>
              <th className="px-2 py-2 text-left font-semibold">Payment</th>
              <th className="px-2 py-2 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-xs text-gray-500 divide-gray-200">
            {[...Array(10)].map((_, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-2 py-2  font-medium">TXN-{2000 + i}</td>
                <td className="px-2 py-2 ">2024-01-30 {10 + i}:30</td>
                <td className="px-2 py-2 ">Customer {i + 1}</td>
                <td className="px-2 py-2  font-semibold">19.{i + 1}</td>
                <td className="px-2 py-2 ">{i % 2 === 0 ? 'Cash' : 'Card'}</td>
                <td className="px-2 py-2 ">
                  <button className="text-primary-600 hover:text-primary-700 font-medium">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
