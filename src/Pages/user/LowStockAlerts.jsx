import React, { useState, useEffect } from "react";

const LowStockAlerts = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    // Generate random stocks once on mount
    setStocks([1, 2, 3, 4, 5].map(() => Math.floor(Math.random() * 8)));
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Low Stock Alerts</h3>
        <p className="text-gray-600 text-xs mt-1">Products requiring restock attention</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
            <tr className="text-xs text-gray-600 font-semibold ">
              <th className="px-6 py-3 text-left text-xs ">Product</th>
              <th className="px-6 py-3 text-left text-xs font-semibold">Current Stock</th>
              <th className="px-6 py-3 text-left text-xs font-semibold">Min Required</th>
              <th className="px-6 py-3 text-left text-xs font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y text-gray-500 divide-gray-200">
            {stocks.map((stock, idx) => {
              const status = stock <= 3 ? 'Critical' : stock <= 5 ? 'Low' : 'Attention';
              const color = stock <= 3 ? 'bg-red-100 text-red-700' : stock <= 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700';
              
              return (
                <tr key={idx + 1} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">Product {idx + 1}</td>
                  <td className="px-6 py-4 text-sm font-bold text-red-600">{stock}</td>
                  <td className="px-6 py-4 text-sm">8</td>
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
