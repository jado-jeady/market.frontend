import { useState, useEffect } from 'react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // TODO: Replace with your actual API endpoint
        const response = await fetch('/api/products');
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-1 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Product List</h3>
          <p className="text-gray-600 text-xs mt-1">Browse and manage all products</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-2 py-2 border-2 border-gray-600 text-gray-600 rounded-lg hover:bg-gray-50 transition">
            Export List
          </button>
          
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-2 mb-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search products..."
            className="px-4 py-2 border border-gray-300 rounded-lg text-xs text-gray-500 focus:ring-2 focus:ring-gray-500 outline-none"
          />
          <select className="px-4 py-2 border border-gray-300  text-xs text-gray-500 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none">
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Clothing</option>
            <option>Food & Beverages</option>
            <option>Home & Garden</option>
          </select>
          <select className="px-4 py-2 border text-xs border-gray-300 text-gray-500 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none">
            <option>All Status</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>
          <button className="px-4 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            Apply Filters
          </button>
        </div>
      </div>

      {/* Products Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => {
          const stock = Math.floor(Math.random() * 100);
          const stockStatus = stock > 50 ? 'In Stock' : stock > 10 ? 'Low Stock' : 'Out of Stock';
          const stockColor = stock > 50 ? 'text-green-600' : stock > 10 ? 'text-yellow-600' : 'text-red-600';

          return (
            <div key={item} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
              {/* Product Image */}
              <div className="h-24 bg-gradient-to-br from-gray-100 to-secondary-100 flex items-center justify-center">
                <svg className="w-20 h-20 p-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-xs  text-gray-900">Product Name {item}</h3>
                    <p className="text-xs text-gray-500">SKU: PRD-{2000 + item}</p>
                  </div>
                  <span className={`text-xs font-medium ${stockColor}`}>
                    {stockStatus}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold text-gray-600">${(Math.random() * 100 + 10).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Stock:</span>
                    <span className="font-semibold text-gray-500 ">{stock} units</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Category:</span>
                    <span className="text-gray-900 text-xs">{item % 2 === 0 ? 'Electronics' : 'Clothing'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 py-2 bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition text-xs font-medium">
                    Edit
                  </button>
                  <button className="flex-1 py-2 bg-gray-50 text-blue-600  rounded hover:bg-gray-100 transition text-xs font-medium">
                    View
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-center">
        <div className="flex space-x-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
            Previous
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition">
            1
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
            2
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
            3
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
