const Approved = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Approved Productions</h1>
        <p className="text-gray-600 mt-1">Productions approved and available for sale</p>
      </div>

      <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
        <div className="flex">
          <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-green-700">
            These productions have been approved by the cashier and are now available in the system.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-gray-600">
          <thead className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Batch ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Items</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Quantity</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Approved By</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Approved At</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Remaining</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[...Array(8)].map((_, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium">BATCH-{1000 + i}</td>
                <td className="px-6 py-4 text-sm">Sambusa, Mandazi</td>
                <td className="px-6 py-4 text-sm font-semibold">{Math.floor(Math.random() * 100 + 50)}</td>
                <td className="px-6 py-4 text-sm">Cashier {i + 1}</td>
                <td className="px-6 py-4 text-sm">Today 09:{String(i * 5).padStart(2, '0')}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="font-semibold text-green-600">{Math.floor(Math.random() * 50)}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Approved;