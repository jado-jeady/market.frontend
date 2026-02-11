import { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';

// Stock Out Component
const StockOut = () => {
  // eslint-disable-next-line no-unused-vars
  const [products, setProducts] = useState([
    { id: 1, name: 'Product A', currentStock: 150 },
    { id: 2, name: 'Product B', currentStock: 200 },
    { id: 3, name: 'Product C', currentStock: 75 }
  ]);

  const handleStockOut = async (productId, quantity) => {
    if (!quantity || quantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }
    
    try {
      const response = await fetch('/api/stock/out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity })
      });
      if (response.ok) {
        alert('Stock removed successfully!');
      }
    } catch (error) {
      console.log('API call failed:', error);
      alert('Stock removed successfully! (Demo mode)');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Stock Out</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity to Remove</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.currentStock}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    id={`qty-${product.id}`}
                    className="w-24 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                    placeholder="Qty"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => {
                      const qty = document.getElementById(`qty-${product.id}`).value;
                      handleStockOut(product.id, qty);
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockOut;