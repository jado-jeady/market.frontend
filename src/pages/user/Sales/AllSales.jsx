import { useEffect, useState } from "react";
import { getMySales } from "../../../utils/sales.util";
import ReturnModal from "./ReturnModel";
import {
  Eye,
  RotateCcw,
  Calendar,
  CreditCard,
  Hash,
  X,
  List,
} from "lucide-react";

const AllSales = () => {
  const [sales, setSales] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);

  const [selectedSale, setSelectedSale] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  // States for the Item Quick Preview
  const [itemPreviewSale, setItemPreviewSale] = useState(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const filters = { page, limit: 10, payment_method: paymentMethod };
      if (date) {
        filters.start_date = `${date}T00:00:00`;
        filters.end_date = `${date}T23:59:59`;
      }
      const response = await getMySales(filters);
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

  const filteredSales = sales.filter((sale) =>
    sale.invoice_number?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleOpenDetails = (sale) => {
    setSelectedSale(sale);
    setIsModalOpen(true);
  };

  const handleOpenItemPreview = (sale) => {
    setItemPreviewSale(sale);
    setIsItemModalOpen(true);
  };

  return (
    <div className="p-4 md:p-6 py-0 bg-gray-50 min-h-screen">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">My Sales</h2>
        <p className="text-xs text-gray-500">
          Track and manage your transactions
        </p>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-3 text-gray-600 rounded-lg shadow-sm mb-4 grid grid-cols-2 md:grid-cols-4 gap-2 border border-gray-100">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Invoice #"
          className="border px-2 h-9 text-sm rounded-md bg-gray-50 outline-none"
        />
        <select
          value={paymentMethod}
          onChange={(e) => {
            setPaymentMethod(e.target.value);
            setPage(1);
          }}
          className="border h-9 text-xs rounded-md bg-gray-50"
        >
          <option value="">All Payments</option>
          <option value="cash">Cash</option>
          <option value="momo">MoMo</option>
          <option value="card">Card</option>
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setPage(1);
          }}
          className="border h-9 text-xs rounded-md bg-gray-50 px-2"
        />
        <button
          onClick={() => {
            setPage(1);
            setSearch("");
            setPaymentMethod("");
            setDate("");
          }}
          className="bg-gray-100 text-xs font-semibold rounded-md h-9 hover:bg-gray-200"
        >
          Reset
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin h-8 w-8 border-b-2 border-green-600 text-gray-600 rounded-full"></div>
          <p className="text-gray-500 p-5">loading Your sales... </p>
        </div>
      ) : (
        <>
          {/* MOBILE GRID VIEW */}
          <div className="grid grid-cols-1 gap-3 md:hidden mb-4">
            {filteredSales.map((sale) => (
              <div
                key={sale.id}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-gray-800">
                    {sale.invoice_number}
                  </h3>
                  <span
                    className={`text-[10px] px-2 py-1 rounded-full font-bold ${sale.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}
                  >
                    {sale.status}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="text-xs font-black text-green-700">
                    {Number(sale.subtotal).toLocaleString()} RWF
                  </span>
                  <button
                    onClick={() => handleOpenItemPreview(sale)}
                    className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded"
                  >
                    Items: {sale.items.length}
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenDetails(sale)}
                      className="p-2 bg-gray-50 rounded-lg text-gray-600"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSale(sale);
                        setIsReturnModalOpen(true);
                      }}
                      className="p-2 bg-orange-50 rounded-lg text-orange-600"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-300">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Invoice</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4 text-right">item Count</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Shift</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y text-gray-600 divide-gray-100">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-3 py-1 text-sm font-medium">
                      {sale.invoice_number}
                    </td>
                    <td className="px-6 py-2 text-xs">
                      {new Date(sale.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-xs capitalize">
                      {sale.payment_method}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-right">
                      <button
                        onClick={() => handleOpenItemPreview(sale)}
                        className="text-blue-600 hover:text-blue-800 underline decoration-dotted"
                      >
                        {sale.items.length} Items
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-right">
                      {Number(sale.subtotal).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`text-[10px] px-2 py-1 rounded-full font-bold ${sale.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}
                      >
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">{sale.shift_id}</td>
                    <td className="px-6 py-4 text-center flex justify-center gap-3">
                      <button
                        onClick={() => handleOpenDetails(sale)}
                        className="text-green-600 font-semibold text-xs"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSale(sale);
                          setIsReturnModalOpen(true);
                        }}
                        className="text-orange-600 font-semibold text-xs"
                      >
                        Return
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* PAGINATION */}
      <div className="mt-4 flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100 text-xs">
        <span className="text-gray-700">
          Page {pagination.page} / {pagination.pages}
        </span>
        <div className="flex gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="font-bold text-green-600 disabled:text-gray-500"
          >
            Prev &nbsp;|
          </button>
          <button
            disabled={page === pagination.pages}
            onClick={() => setPage((p) => p + 1)}
            className="font-bold text-green-600 disabled:text-gray-500"
          >
            Next
          </button>
        </div>
      </div>

      {/* ITEM PREVIEW MODAL */}
      {isItemModalOpen && itemPreviewSale && (
        <div className="fixed inset-0 z-[60] flex justify-center items-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-2 text-gray-800">
                <List className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-xs uppercase">
                  Items: {itemPreviewSale.invoice_number}
                </h3>
              </div>
              <button
                onClick={() => setIsItemModalOpen(false)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[50vh] overflow-y-auto">
              <table className="w-full text-left text-[11px]">
                <thead className="sticky top-0 bg-white border-b text-gray-400 font-bold uppercase">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3 text-center">Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {itemPreviewSale.items.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/30">
                      <td className="p-3">
                        <p className="font-semibold text-gray-700">
                          {item.product_name}
                        </p>
                        <p className="text-[9px] text-gray-400">
                          {item.barcode}
                        </p>
                      </td>
                      <td className="p-3 text-center">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-black">
                          {item.quantity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t bg-gray-50 text-center">
              <button
                onClick={() => setIsItemModalOpen(false)}
                className="text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RETURN MODAL */}
      {isReturnModalOpen && (
        <ReturnModal
          sale={selectedSale}
          onClose={() => {
            setIsReturnModalOpen(false);
            fetchSales();
          }}
          onCuncel={() => {
            setIsReturnModalOpen(false);
            setSelectedSale(null);
          }}
        />
      )}

      {/* SALE DETAILS MODAL */}
      {isModalOpen && selectedSale && (
        <div className="fixed inset-0 z-50 flex justify-center items-center text-gray-600 bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto relative p-6">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="border-b pb-4 mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Invoice: {selectedSale.invoice_number}
              </h2>
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <p>
                  <span className="font-medium text-gray-400">Cashier:</span>{" "}
                  {selectedSale.user?.full_name || "N/A"}
                </p>
                <p>
                  <span className="font-medium text-gray-400">Payment:</span>{" "}
                  {selectedSale.payment_method}
                </p>
                <p>
                  <span className="font-medium text-gray-400">Date:</span>{" "}
                  {new Date(selectedSale.created_at).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium text-gray-400">Status:</span>{" "}
                  {selectedSale.status}
                </p>
              </div>
            </div>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-3">Item</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {selectedSale.items.map((item) => (
                  <tr key={item.id}>
                    <td className="p-3 text-gray-800">
                      {item.product_name || item.product?.name}
                    </td>
                    <td className="p-3 text-center">{item.quantity}</td>
                    <td className="p-3 text-right">
                      {Number(item.unit_price).toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-medium">
                      {Number(item.total_price).toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-black">
                  <td
                    colSpan="3"
                    className="p-3 text-right text-gray-900 uppercase text-xs"
                  >
                    Grand Total
                  </td>
                  <td className="p-3 text-right text-green-700 text-base">
                    {Number(selectedSale.subtotal).toLocaleString()} RWF
                  </td>
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
