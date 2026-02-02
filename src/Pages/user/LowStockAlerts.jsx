const LowStockAlerts = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Low Stock Alerts</h1>
        <p className="text-gray-600 mt-1">Products requiring restock attention</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Critical (0-5)</p>
          <p className="text-2xl font-bold text-red-600 mt-1">3</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm">Low (6-10)</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">7</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Attention (11-20)</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">12</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Product</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Current Stock</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Min Required</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[1, 2, 3, 4, 5].map((item) => {
              const stock = Math.floor(Math.random() * 15);
              const status = stock <= 5 ? 'Critical' : stock <= 10 ? 'Low' : 'Attention';
              const color = stock <= 5 ? 'bg-red-100 text-red-700' : stock <= 10 ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700';
              
              return (
                <tr key={item} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">Product {item}</td>
                  <td className="px-6 py-4 text-sm font-bold text-red-600">{stock}</td>
                  <td className="px-6 py-4 text-sm">20</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                      Order Now
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

export default LowStockAlerts;
