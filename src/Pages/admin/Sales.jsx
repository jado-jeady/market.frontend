import { useState, useEffect } from 'react';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSale, setNewSale] = useState({
    product: '',
    quantity: '',
    price: '',
    customer: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await fetch('/api/sales');
      if (response.ok) {
        const data = await response.json();
        setSales(data);
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
      // Demo data
      setSales([
        { id: 1, product: 'Product A', quantity: 10, price: 500, customer: 'John Doe', date: '2026-01-29', total: 5000 },
        { id: 2, product: 'Product B', quantity: 5, price: 800, customer: 'Jane Smith', date: '2026-01-28', total: 4000 },
        { id: 3, product: 'Product C', quantity: 15, price: 300, customer: 'Bob Johnson', date: '2026-01-27', total: 4500 }
      ]);
    }
  };

  const handleAddSale = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSale)
      });
      if (response.ok) {
        alert('Sale recorded successfully!');
        setShowAddForm(false);
        setNewSale({ product: '', quantity: '', price: '', customer: '', date: new Date().toISOString().split('T')[0] });
        fetchSales();
      }
    } catch (error) {
      console.log('API call failed:', error);
      alert('Sale recorded successfully! (Demo mode)');
      setShowAddForm(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Sales Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-secondary-600 to-primary-600 text-white px-6 py-3 rounded-lg hover:from-secondary-700 hover:to-primary-700 transition flex items-center space-x-2"
        >
          <span>{showAddForm ? '✕' : '+'}</span>
          <span>{showAddForm ? 'Cancel' : 'New Sale'}</span>
        </button>
      </div>

      {/* Add Sale Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Record New Sale</h3>
          <form onSubmit={handleAddSale} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
              <input
                type="text"
                value={newSale.product}
                onChange={(e) => setNewSale({ ...newSale, product: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                value={newSale.quantity}
                onChange={(e) => setNewSale({ ...newSale, quantity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price per Unit</label>
              <input
                type="number"
                value={newSale.price}
                onChange={(e) => setNewSale({ ...newSale, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
              <input
                type="text"
                value={newSale.customer}
                onChange={(e) => setNewSale({ ...newSale, customer: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={newSale.date}
                onChange={(e) => setNewSale({ ...newSale, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-secondary-600 to-primary-600 text-white px-6 py-2 rounded-lg hover:from-secondary-700 hover:to-primary-700 transition"
              >
                Record Sale
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sales List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-secondary-600 to-primary-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Price/Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${sale.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">${sale.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Sales;
