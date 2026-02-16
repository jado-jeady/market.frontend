import { useState, useEffect } from 'react';
import { getStockAdjustments } from '../../../Utils/product.util';

const StockAdjustment = () => {
  const [adjustments, setAdjustments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [filterType, setFilterType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await getStockAdjustments();
        console.log(data)
        setAdjustments(Array.isArray(data) ? data : data?.data || []);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // COMBINED FILTER LOGIC
  const filteredData = adjustments.filter((item) => {
    const matchesType = filterType === 'ALL' || item.type === filterType;
    const matchesSearch = 
      item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.barcode?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesSearch;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* HEADER SECTION */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">Stock Adjustment History</h3>
        <p className="text-sm text-gray-500">Track all manual stock entries and removals</p>
      </div>

      {/* FILTERS BAR */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
        
        {/* Search Input */}
        <div className="relative w-full lg:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by product name or barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full text-gray-500 pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        {/* Tab Switcher (Type Filter) */}
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 w-full lg:w-auto">
          {['ALL', 'IN', 'OUT'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex-1 lg:flex-none px-6 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterType === type
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {type === 'ALL' ? 'All' : type === 'IN' ? 'Stock In' : 'Stock Out'}
            </button>
          ))}
        </div>
      </div>

      {/* RESPONSIVE TABLE */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs truncate font-bold text-gray-500 tracking-wider">Product Info</th>
              <th className="px-6 py-4 text-left text-xs truncate font-bold text-gray-500 tracking-wider">Type</th>
              <th className="px-6 py-4 text-left text-xs truncate font-bold text-gray-500 tracking-wider">Qty Change</th>
              <th className="px-6 py-4 text-left text-xs truncate font-bold text-gray-500 tracking-wider">Reason</th>
              <th className="px-6 py-4 text-left text-xs truncate font-bold text-gray-500 tracking-wider">Perfomed By </th>
              <th className="px-6 py-4 text-left text-xs truncate font-bold text-gray-500 tracking-wider">Date</th>

              <th className="px-6 py-4 text-left text-xs truncate font-bold text-gray-500 tracking-wider">Updated At</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Fetching records...</span>
                  </div>
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{item?.Product?.name}</div>
                    <div className="text-[11px] text-gray-400 font-mono">{item.barcode}</div>
                  </td>
                  <td className="px-3 py-1 whitespace-nowrap">
                    <span className={`px-2.5 py-1 text-[8px] font-bold rounded-md ${
                      item.type === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-xs font-black ${
                    item.type === 'IN' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.type === 'IN' ? '+' : '-'}{item.quantity}
                  </td>
                  <td className="px-2 py-2 text-wrap text-xs text-gray-600 italic max-w-xs">
                    {item.reason || 'No reason specified'}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-600 italic max-w-xs truncate">
                    {item.User.username || 'No User specified'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                    {new Date(item.updatedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-16 text-center">
                  <div className="text-gray-400 mb-2 font-medium">No records found matching your filters</div>
                  <button 
                    onClick={() => {setSearchTerm(''); setFilterType('ALL');}}
                    className="text-blue-500 text-sm hover:underline"
                  >
                    Clear all filters
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockAdjustment;
