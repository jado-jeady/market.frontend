import { useState } from 'react';
import { Link } from 'react-router-dom';

const SearchCustomer = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Search Customer</h3>
        <p className="text-gray-600 text-xs mt-1">Find customer details and history</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, phone, or email..."
          className="w-full px-4 text-gray-400 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
        />
      </div>

      {searchTerm ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-5 h-4 text-green-600 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center font-semibold text-lg mr-3">
                    C{i}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900">Customer {i}</h3>
                    <p className="text-[0.625rem] text-gray-500">+1 000-{String(i).padStart(4, '0')}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[0.625rem] font-medium">
                  Active
                </span>
              </div>
              <div className="space-y-2 text-xs pb-4 text-gray-500">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Purchases:</span>
                  <span className="font-semibold ">${(Math.random() * 2000 + 500).toFixed(2)}</span>
                </div>
                <div className="flex text-xs justify-between">
                  <span className="text-gray-600">Loyalty Points:</span>
                  <span className="font-semibold text-primary-600">{Math.floor(Math.random() * 500)}</span>
                </div>
                <div className="flex text-xs justify-between">
                  <span className="text-gray-600">Last Visit:</span>
                  <span>{i} days ago</span>
                </div>
              </div>
              <Link to={`/customer/${i}`} className="w-full m-11 justify-center text-sm bg-primary-50 text-blue-600 rounded-lg hover:bg-primary-100 transition font-medium">
                View Full Profile
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p>Enter a search term to find customers</p>
        </div>
      )}
    </div>
  );
};

export default SearchCustomer;
