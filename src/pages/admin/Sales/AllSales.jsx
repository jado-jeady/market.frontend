import { useEffect, useState } from 'react';
import {
  getAllSales,
  getCashiers,
  getSaleById,
  confirmSaleReturn
} from '../../../utils/sales.util';
import { Download } from 'lucide-react';

const AllSales = () => {
  /* ===================== STATE ===================== */
  const [sales, setSales] = useState([]);
  const [cashiers, setCashiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false); // New state for table loading
  const [limit, setLimit] = useState(20);

  const [filters, setFilters] = useState({
    orderId: '',
    status: '',
    date: '',
    cashierId: '',
    shiftDate: "",
  });

  const [selectedSale, setSelectedSale] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /* ===================== FETCH ===================== */

  const fetchSales = async (showTableLoader = true) => {
    if (showTableLoader) setTableLoading(true);
    setLoading(true);
    
    const response = await getAllSales({limit:10000,page:1});
    if (response?.success) {
      setSales(response.data);
    }
    
    setLoading(false);
    if (showTableLoader) setTableLoading(false);
  };

  const fetchCashiers = async () => {
    const response = await getCashiers();
    if (response?.success) {
      setCashiers(response.data);
    }
  };

  useEffect(() => {
    (async () => {
      await Promise.all([fetchSales(), fetchCashiers()]);
    })();
  }, []);

  /* ===================== FILTERING ===================== */

  const filteredSales = sales.filter((sale) => {
    const matchesOrderId =
      !filters.orderId || sale.invoice_number?.includes(filters.orderId);
    const matchesStatus =
      !filters.status || sale.status === filters.status;
    const matchesCashier =
      !filters.cashierId || sale.user?.id === Number(filters.cashierId);
    const matchesDate =
      !filters.date || sale.created_at?.slice(0, 10) === filters.date;
    const matchesShiftDate =
      !filters.shiftDate || sale.shift?.business_date === filters.shiftDate;

    return (
      matchesOrderId &&
      matchesStatus &&
      matchesCashier &&
      matchesDate &&
      matchesShiftDate
    );
  });

  const limitedSales = filteredSales.slice(0, limit);

  const totalCash = filteredSales.reduce(
    (sum, sale) => sum + Number(sale.subtotal || 0),
    0
  );

  /* ===================== ACTIONS ===================== */

  const openSaleDetails = async (saleId) => {
    setTableLoading(true); // Show loading in table while fetching details
    const response = await getSaleById(saleId);
    if (response?.success) {
      setSelectedSale(response.data);
      setShowModal(true);
    }
    setTableLoading(false);
  };

  const handleReturn = async (saleId) => {
    if (!window.confirm('Confirm return for this sale?')) return;
    setTableLoading(true);
    const response = await confirmSaleReturn(saleId);
    if (response?.success) {
      await fetchSales(false); // Pass false to not show table loader again
    }
    setTableLoading(false);
  };

  const resetFilters = () => {
    setFilters({
      orderId: '',
      status: '',
      date: '',
      cashierId: '',
      shiftDate: ""
    });
  };

  // Refresh data function
  const refreshData = async () => {
    setTableLoading(true);
    await fetchSales(false);
    setTableLoading(false);
  };

  /* ===================== UI ===================== */

  // Skeleton loader for table rows
  const TableSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <tr key={index} className="border-t animate-pulse">
          <td className="px-2 py-2"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
          <td className="px-2 py-2"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
          <td className="px-2 py-2"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
          <td className="px-2 py-2"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
          <td className="px-2 py-2"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
          <td className="px-2 py-2"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
          <td className="px-2 py-2"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
        </tr>
      ))}
    </>
  );

  return (
    <div className="p-6 py-2">
      {/* Header - Always visible */}
      <div className="mb-2 flex flex-col sm:flex-row justify-between gap-2">
        <div>
          <h3 className="text-xl font-bold text-gray-900">All Sales</h3>
          <p className="text-sm text-gray-600">
            Manage and track all sales transactions
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={refreshData}
            className="px-4 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors self-start"
            disabled={tableLoading}
          >
            <span>Refresh</span>
            {tableLoading && (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            )}
          </button>
          <button className="px-4 py-2 text-xs bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors self-start">
            <span>Export All {sales.length > 0 && <span>{sales.length}</span>} Sales</span>
            <Download name="download" size={16} />
          </button>
        </div>
      </div>

      {/* Filters - Always visible */}
      <div className="bg-white text-gray-500 rounded-lg shadow-md p-2 mb-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3">
          <input
            value={filters.orderId}
            onChange={(e) =>
              setFilters({ ...filters, orderId: e.target.value })
            }
            placeholder="Search Order ID"
            className="h-7 px-2 text-xs border rounded w-full"
            disabled={tableLoading}
          />

          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
            className="h-7 px-2 text-xs border rounded w-full"
            disabled={tableLoading}
          >
            <option value="">All Status</option>
            <option value="COMPLETED">Completed</option>
            <option value="RETURNED">Returned</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          
          <select
            value={filters.shiftDate}
            onChange={(e) => setFilters({ ...filters, shiftDate: e.target.value })}
            className="h-7 px-2 text-xs border rounded w-full"
            disabled={tableLoading}
          >
            <option value="">All Shifts</option>
            {[...new Set(sales.map((s) => s.shift?.business_date))].map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>

          <select
            value={filters.cashierId}
            onChange={(e) =>
              setFilters({ ...filters, cashierId: e.target.value })
            }
            className="h-7 px-2 text-xs border rounded w-full"
            disabled={tableLoading}
          >
            <option value="">All Cashiers</option>
            {cashiers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.full_name || c.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={filters.date}
            onChange={(e) =>
              setFilters({ ...filters, date: e.target.value })
            }
            className="h-7 px-2 text-xs border rounded w-full"
            disabled={tableLoading}
          />

          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="h-7 px-2 text-xs border rounded w-full"
            disabled={tableLoading}
          >
            <option value={20}>Show 20</option>
            <option value={40}>Show 40</option>
            <option value={60}>Show 60</option>
            <option value={80}>Show 80</option>
            <option value={100}>Show 100</option>
            <option value={200}>Show 200</option>
          </select>

          <button
            onClick={resetFilters}
            className="h-7 bg-gray-100 text-sm rounded hover:bg-gray-200 w-full"
            disabled={tableLoading}
          >
            Reset Filters
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
          <span className="text-sm font-bold text-gray-900">
            Showing {limitedSales.length} of {filteredSales.length} sales
          </span>
          <p className="text-sm text-gray-600">
            {filters.shiftDate
              ? `Total cash for shift ${filters.shiftDate} Is : ${totalCash.toFixed(2)} frw`
              : `Total Amount Is : ${totalCash.toFixed(2)} frw`}
          </p>
        </div>
      </div>

      {/* Table with loading state */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto relative">
        {tableLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <div className="bg-white p-3 rounded-lg shadow-lg flex items-center gap-2">
              <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
              <span className="text-sm text-gray-600">Loading sales...</span>
            </div>
          </div>
        )}
        
        <table className="w-full text-xs min-w-[800px]">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-2 py-2 text-left">Order ID</th>
              <th className="px-2 py-2">Customer</th>
              <th className="px-2 py-2">Cashier</th>
              <th className="px-2 py-2">Date</th>
              <th className="px-2 py-2">Amount</th>
              <th className="px-2 py-2">Status</th>
              <th className="px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tableLoading ? (
              <TableSkeleton />
            ) : (
              limitedSales.map((sale) => (
                <tr key={sale.id} className="border-t text-gray-600 hover:bg-gray-50">
                  <td className="px-2 py-2 font-semibold">
                    {sale.invoice_number}
                  </td>
                  <td className="px-2 py-2">
                    {sale.customer_name || 'Walk-in'}
                  </td>
                  <td className="px-2 py-2 text-center">
                    {sale.user?.full_name}
                  </td>
                  <td className="px-2 py-2">
                    {sale.created_at?.slice(0, 10)}
                  </td>
                  <td className="px-2 py-2 font-semibold">
                    {Number(sale.subtotal).toFixed(2)}
                  </td>
                  <td className="px-2 py-2">{sale.status}</td>
                  <td className="px-2 py-2 space-x-2">
                    <button
                      onClick={() => openSaleDetails(sale.id)}
                      className="text-green-600 hover:text-green-800"
                      disabled={tableLoading}
                    >
                      View
                    </button>
                    {sale.status === 'COMPLETED' && (
                      <button
                        onClick={() => handleReturn(sale.id)}
                        className="text-blue-600 hover:text-blue-800"
                        disabled={tableLoading}
                      >
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}

            {!tableLoading && limitedSales.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No sales found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Show more indicator */}
      {!tableLoading && filteredSales.length > limit && (
        <div className="text-center mt-2">
          <p className="text-xs text-gray-500">
            Showing first {limit} of {filteredSales.length} sales. 
            <button 
              onClick={() => setLimit(prev => Math.min(prev + 20, filteredSales.length))}
              className="text-blue-600 hover:text-blue-800 ml-1"
              disabled={tableLoading}
            >
              Load more
            </button>
          </p>
        </div>
      )}

      {/* Modal - Keep as is */}
      {showModal && selectedSale && (
        <div className="fixed inset-0 z-50 text-gray-600 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white p-4 rounded-lg w-full max-w-[600px] max-h-[80vh] overflow-y-auto">
            <h3 className="font-bold mb-2 text-lg">Sale Details</h3>
            {/* ... rest of modal content remains the same ... */}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllSales;