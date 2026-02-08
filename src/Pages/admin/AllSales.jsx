import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AllSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        // TODO: Replace with your actual API endpoint
        const response = await fetch('/api/sales');
        if (response.ok) {
          const data = await response.json();
          setSales(data);
        }
      } catch (error) {
        console.error('Error fetching sales:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 py-0">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold  mt-2 text-gray-900">All Sales</h3>
          <p className="text-gray-600 text-sm mt-1">Manage and track all sales transactions</p>
        </div>
        <button className="px-3 py-2 text-xs bg-green-600 text-white rounded-lg hover:from-gray-700 hover:to-gray-700 transition shadow-md">
          Export Sales {sales.length}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-2 mb-1">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by order ID..."
            className="px-4 py-2 border border-gray-300 text-xs text-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent h-7 w-auto outline-none"
          />
          <select className=" px-2 border border-gray-300 text-xs text-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent h-7 w-auto outline-none">
            <option >All Status</option>
            <option>Pending</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 text-xs text-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent h-7 w-auto outline-none"
          />
          <button className=" h-7 w-auto text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            Apply Filters
          </button>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r text-sm text-center from-primary-600 to-secondary-600 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Order ID</th>
                <th className="px-6 py-3 text-left font-semibold">Customer</th>
                <th className="px-6 py-3 text-left font-semibold">Cashier</th>
                <th className="px-6 py-3 text-left font-semibold">Date</th>
                <th className="px-6 py-3 text-left font-semibold">Amount</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <tr key={item} className="hover:bg-gray-50 text-gray-700 text-xs transition">
                  <td className="px-2 py-2 font-medium text-gray-900">
                    #ORD-{1000 + item}
                  </td>
                  <td className="px-2 py-2 text-gray-700">
                    John Doe {item}
                  </td>
                  <td className='text-center px-2 py-2'>Cashier {item}</td>
                  <td className="px-2 py-2 text-gray-700">
                    2024-01-{String(item).padStart(2, '0')}
                  </td>
                  <td className="px-2 py-2 font-semibold text-gray-900">
                    ${(Math.random() * 500 + 50).toFixed(2)}
                  </td>
                  <td className="px-2 py-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item % 3 === 0
                        ? 'bg-green-100 text-green-700'
                        : item % 3 === 1
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {item % 3 === 0 ? 'Completed' : item % 3 === 1 ? 'Pending' : 'Processing'}
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <Link to={`/user/sales/all/${item}`} className="text-green-600 hover:text-primary-700 font-medium mr-3">
                      view
                    </Link>
                    <Link className="text-blue-600 hover:text-secondary-700 font-medium">
                      return
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium ">1</span> to <span className="font-medium">8</span> of{' '}
            <span className="font-medium">97</span> results
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
              Previous
            </button>
            <button className="px-4 py-2 bg-gray-300 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition">
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
    </div>
  );
};

export default AllSales;
