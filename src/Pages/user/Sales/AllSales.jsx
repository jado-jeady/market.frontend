import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMySales } from '../../../utils/sales.util';

const AllSales = () => {
  

  const [sales, setSales] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 100,
    pages: 1
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);

  const [selectedSale, setSelectedSale] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);



  const fetchSales = async () => {
    setLoading(true);
    try {
      const filters = {
        page,
        limit: pagination.limit,
        payment_method: paymentMethod
        
      };

      if (paymentMethod) filters.payment_method = paymentMethod;
      if (date) {
        filters.start_date = `${date}T00:00:00`;
        filters.end_date = `${date}T23:59:59`;
      }

      const response = await getMySales(filters);
      console.log("Fetched sales data:", response);

      if (response.success) {
        setSales(response.data);
        setPagination(response.pagination);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [page, paymentMethod, date]);

  const filteredSales = sales.filter(sale =>
    sale.invoice_number?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-10 w-10 border-b-2 border-green-600 rounded-full"></div>
      </div>
    );
  }

//Open Sales details modal

  const openSaleModal = (saleId) => {
  const sale = sales.find(s => s.id === saleId); // find from already loaded data
  if (sale) {
    setSelectedSale(sale);
    setIsModalOpen(true);
  }
};

  return (
    <div className="p-6 py-0">
      {/* HEADER */}
      <div className="mb-3">
        <h2 className="text-xl font-bold text-gray-900">My Sales</h2>
        <p className="text-sm text-gray-600">
          Sales you personally handled
        </p>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-3 text-gray-600 rounded shadow mb-2 grid grid-cols-1 md:grid-cols-4 gap-2">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search invoice..."
          className="border px-2 h-8 text-xs rounded"
        />

        <select
          value={paymentMethod}
          onChange={e => { setPaymentMethod(e.target.value); setPage(1); }}
          className="border h-8 text-xs rounded"
        >
          <option value="">All Payments</option>
          <option value="cash">Cash</option>
          <option value="momo">Mobile Money</option>
          <option value="card">Card</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={e => { setDate(e.target.value); setPage(1); }}
          className="border h-8 text-xs rounded"
        />

        <button
          onClick={() => { setPage(1); setSearch(''); setPaymentMethod(''); setDate(''); fetchSales(); }}
          className="bg-gray-100 text-xs rounded h-8"
        >
          Reset Filters
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full border-collapse rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gray-400 text-white">
            <tr className='px-6 py-3  text-sm font-semibold'>
              <th className="p-2 text-text-center">Invoice</th>
              <th className="p-2 text-text-center">Payment</th>
              <th className="p-2 text-text-center">Date</th>
              <th className="p-2 text-text-center">Total Items</th>
              <th className="p-2 text-text-center">Amount</th>
              <th className="p-2 text-text-center">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            <tr>
              
            </tr>
            {filteredSales.map(sale => (
              <tr key={sale.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 text-sm text-gray-700 text-center">{sale.invoice_number}</td>
                <td className="px-6 py-4 text-xs text-gray-500 text-center">{sale.payment_method}</td>
                <td className="px-6 py-4 text-xs text-gray-500 text-center">
                  {new Date(sale.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-xs text-gray-500 text-center">
                  {sale.items.reduce((sum, item) => sum + item.quantity, 0)}

                </td>
                <td className="px-6 py-4 text-xs text-gray-500 text-center">
                  {Number(sale.total_amount).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-xs text-gray-500 text-center">{sale.status}</td>
                <td className="px-6 py-4 text-xs text-gray-500 text-center text-center">
                  <button
                    onClick={() => openSaleModal(sale.id)}
                    className="text-green-600"
                  >
                    View |
                  </button>
                  <Link
                    to={`/user/sales/all/${sale.id}`}
                    className="text-green-600 ml-2"
                  >
                    Return Claim
                  </Link>
                </td>
              </tr>
            ))}

            {filteredSales.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No sales found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-between items-center p-2 bg-gray-200 text-xs">
          <span className='text-gray-600'>
            Page {pagination.page} of {pagination.pages} — Total {pagination.total}
          </span>
          <div className="flex text-sm text-blue-400 gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              Prev |
            </button>
            <button
              disabled={page === pagination.pages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>


      {/* SALE DETAILS MODAL */}
      {isModalOpen && selectedSale && (
  <div className="fixed inset-0 bg-black bg-opacity-50 text-gray-500 flex justify-center items-center z-50">
    <div className="bg-white rounded p-6 w-11/12 md:w-2/3 max-h-[90vh] overflow-auto relative">
      <button
        className="absolute top-2 right-2 text-gray-600 font-bold text-xl"
        onClick={() => setIsModalOpen(false)}
      >
        &times;
      </button>

      <h2 className="text-lg font-bold mb-4">Invoice: {selectedSale.invoice_number}</h2>
      <p className="mb-2">Cashier: {selectedSale.user?.full_name || 'N/A'}</p>
      <p className="mb-2">Payment Method: {selectedSale.payment_method}</p>
      <p className="mb-2">Date: {new Date(selectedSale.created_at).toLocaleString()}</p>
      <p className="mb-2">Status: {selectedSale.status}</p>

      <table className="w-full text-sm mt-4 border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Item</th>
            <th className="border px-2 py-1">Unit Price</th>
            <th className="border px-2 py-1">Quantity</th>
            <th className="border px-2 py-1">Total</th>
          </tr>
        </thead>
        <tbody>
          {selectedSale.items.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="border px-2 py-1">{item.product_name || item.product?.name}</td>
              <td className="border px-2 py-1">{Number(item.unit_price).toFixed(2)}</td>
              <td className="border px-2 py-1">{item.quantity}</td>
              <td className="border px-2 py-1">{Number(item.total_price).toFixed(2)}</td>
            </tr>
          ))}
          <tr className="font-bold text-right">
            <td colSpan="3" className="border text-left px-2 py-1">Total</td>
            <td className="border px-2 py-1">{Number(selectedSale.subtotal).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
)}


    </div>
  );
};

export default AllSales;
