import { useState, useEffect } from 'react';

const AllStock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // TODO: Replace with your actual API endpoint
        const response = await fetch('/api/stock/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Inventory</h1>
          <p className="text-gray-600 mt-1">Manage and track all product inventory</p>
        </div>
        <button className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition shadow-md">
          Add New Product
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total Products{}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{products.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">In Stock</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">987</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm">Low Stock</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">45</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Out of Stock</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search products..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none">
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Clothing</option>
            <option>Food</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none">
            <option>All Stock Status</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            Apply Filters
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Product ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Quantity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => {
                const quantity = Math.floor(Math.random() * 150);
                const status = quantity > 50 ? 'In Stock' : quantity > 10 ? 'Low Stock' : 'Out of Stock';
                const statusColor = quantity > 50 ? 'bg-green-100 text-green-700' : quantity > 10 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';

                return (
                  <tr key={item} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      PRD-{2000 + item}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      Product Name {item}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item % 3 === 0 ? 'Electronics' : item % 3 === 1 ? 'Clothing' : 'Food'}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ${(Math.random() * 100 + 10).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {quantity}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-primary-600 hover:text-primary-700 font-medium mr-3">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-700 font-medium">
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of{' '}
            <span className="font-medium">1,234</span> results
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
              Previous
            </button>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllStock;
