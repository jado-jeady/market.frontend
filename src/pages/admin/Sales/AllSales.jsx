import { useEffect, useState } from 'react';
import {
  getAllSales,
  getCashiers,
  getSaleById,
  confirmSaleReturn
} from '../../../utils/sales.util';
import { Download, Share2 } from 'lucide-react';

const AllSales = () => {
  /* ===================== STATE ===================== */
  const [sales, setSales] = useState([]);
  const [cashiers, setCashiers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    orderId: '',
    status: '',
    date: '',
    cashierId: '',
    shiftDate: "",   // new filter

  });

  const [selectedSale, setSelectedSale] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /* ===================== FETCH ===================== */

  const fetchSales = async () => {
    setLoading(true);
    const response = await getAllSales({limit:10000000,page:1});
    if (response?.success) {
      setSales(response.data);
    }
    setLoading(false);
  };

  const fetchCashiers = async () => {
    const response = await getCashiers();
    if (response?.success) {
      setCashiers(response.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchSales();
      await fetchCashiers();
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

const totalCash = filteredSales.reduce(
  (sum, sale) => sum + Number(sale.subtotal || 0),
  0
);

  /* ===================== ACTIONS ===================== */

  const openSaleDetails = async (saleId) => {
    const response = await getSaleById(saleId);
    if (response?.success) {
      setSelectedSale(response.data);
      setShowModal(true);
    }
  };

  const handleReturn = async (saleId) => {
    if (!window.confirm('Confirm return for this sale?')) return;
    const response = await confirmSaleReturn(saleId);
    if (response?.success) {
      fetchSales();
    }
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

  /* ===================== UI ===================== */

  if (loading) {
    return (
      <div className="p-6 flex mt-20 justify-center">
        <div className="inline-block animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full" />
                    </div>
    );
  }

  return (
    <div className="p-6 py-2">
      {/* Header */}
      <div className="mb-2 flex justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">All Sales</h3>
          <p className="text-sm text-gray-600">
            Manage and track all sales transactions
          </p>
        </div>
        <button className="px-4 py-2 text-xs bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors">
            <span>Export All {sales.length > 0 && <span>{sales.length}</span>} Sales</span>
            <Download name="download" size={16} />
            
        </button>

      </div>

      {/* Filters */}
      <div className="bg-white text-gray-500 rounded-lg shadow-md p-2 mb-1">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <input
            value={filters.orderId}
            onChange={(e) =>
              setFilters({ ...filters, orderId: e.target.value })
            }
            placeholder="Search Order ID"
            className="h-7 px-2 text-xs border rounded"
          />

          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
            className="h-7 px-2 text-xs border rounded"
          >
            <option value="">All Status</option>
            <option value="COMPLETED">Completed</option>
            <option value="RETURNED">Returned</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          
          {/* Shift Filter */}
          <select
            value={filters.shiftDate}
              onChange={(e) => setFilters({ ...filters, shiftDate: e.target.value })}
              className="h-7 px-2 text-xs border rounded"
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
            className="h-7 px-2 text-xs border rounded"
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
            className="h-7 px-2 text-xs border rounded"
          />

          <button
            onClick={resetFilters}
            className="h-7 bg-gray-100 text-sm rounded hover:bg-gray-200"
          >
            Reset Filters
          </button>
        </div>
        {/* displaying the result info */}
       <div className="flex right-0 items-baseline gap-2">
  <span className="text-sm font-bold text-gray-900">
    ({filteredSales.length})
  </span>
  <p className="text-sm  text-gray-600">
    {filters.shiftDate
      ? `Total cash for shift ${filters.shiftDate} Is : ${totalCash.toFixed(2)} frw`
      : `Total Amount Is : ${totalCash.toFixed(2)}`}
  </p>
</div>
      </div>

      {/* Table */}
      <div className="bg-white  rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-xs">
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
            {filteredSales.map((sale) => (
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
                    className="text-green-600"
                  >
                    View
                  </button>
                  {sale.status === 'COMPLETED' && (
                    <button
                      onClick={() => handleReturn(sale.id)}
                      className="text-blue-600"
                    >
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {filteredSales.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No sales found
                </td>
              </tr>
            )}
          </tbody>
          
        </table>
        
        
      </div>

      {/* Modal */}
      {showModal && selectedSale && (
        <div className="fixed inset-0 z-50  text-gray-600 inset-0  bg-opacity-40 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg w-[600px] max-h-[80vh] overflow-y-auto">
            <h3 className="font-bold mb-2">Sale Details</h3>

            <p><b>Invoice:</b> {selectedSale.invoice_number}</p>
            <p><b>Cashier:</b> {selectedSale.user?.full_name}</p>
            <p><b>Status:</b> {selectedSale.status}</p>

            <table className="w-full text-xs mt-3">
              <thead>
                <tr className="border-b">
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedSale.items.map((item) => (
                  <tr key={item.id} className="border-b text-center">
                    <td>{item.product.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unit_price}</td>
                    <td>{item.quantity * item.unit_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right mt-3 font-semibold">
              Grand Total: {selectedSale.subtotal}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-3 px-3 py-1 bg-gray-200 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllSales;
