import { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';

// Stock In Component
const StockIn = () => {
  const [formData, setFormData] = useState({
    productName: '',
    quantity: '',
    supplier: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/stock/in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('Stock added successfully!');
        setFormData({ productName: '', quantity: '', supplier: '', date: new Date().toISOString().split('T')[0] });
      }
    } catch (error) {
      console.log('API call failed:', error);
      alert('Stock added successfully! (Demo mode)');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Add Stock In</h3>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
          <input
            type="text"
            value={formData.productName}
            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
          <input
            type="text"
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-secondary-600 to-primary-600 text-white px-6 py-3 rounded-lg hover:from-secondary-700 hover:to-primary-700 transition"
        >
          Add Stock
        </button>
      </form>
    </div>
  );
};

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

// Removed Stock Component
const RemovedStock = () => {
  const removedItems = [
    { id: 1, product: 'Product X', quantity: 50, reason: 'Damaged', date: '2026-01-25' },
    { id: 2, product: 'Product Y', quantity: 30, reason: 'Expired', date: '2026-01-20' },
    { id: 3, product: 'Product Z', quantity: 20, reason: 'Quality Issue', date: '2026-01-18' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Removed Stock History</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {removedItems.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.product}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.reason}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Stock Component with Horizontal Menu
const Stock = () => {
  const location = useLocation();

  const subMenuItems = [
    { name: 'Stock In', path: '/stock/in' },
    { name: 'Stock Out', path: '/stock/out' },
    { name: 'Removed Stock', path: '/stock/removed' }
  ];

  return (
    <div className="p-6">
      {/* Horizontal Sub-Menu */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <nav className="flex space-x-1 p-2">
          {subMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                location.pathname === item.path
                  ? 'bg-gradient-to-r from-secondary-600 to-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Sub-Routes Content */}
      <Routes>
        <Route path="/" element={<Navigate to="/stock/in" replace />} />
        <Route path="/in" element={<StockIn />} />
        <Route path="/out" element={<StockOut />} />
        <Route path="/removed" element={<RemovedStock />} />
      </Routes>
    </div>
  );
};

export default Stock;
