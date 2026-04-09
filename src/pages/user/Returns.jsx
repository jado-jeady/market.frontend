import { useState, useEffect } from "react";
import { getMyReturns } from "../../utils/sales.util";
import { toast } from "react-toastify";
import {
  Search,
  Filter,
  Loader2,
  RotateCcw,
  Eye,
  X,
  Hash,
  List,
} from "lucide-react";

const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // States for the Item Preview Modal
  const [previewReturn, setPreviewReturn] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Get cashier ID from local storage
  const authData = JSON.parse(localStorage.getItem("user"));
  const userId = authData?.data?.user?.id;

  const fetchReturns = async () => {
    setLoading(true);
    try {
      // Use your dynamic function with the cashier's ID
      const data = await getMyReturns(userId);

      // Access 'returns' from the { returns, count } response object
      if (data && data.returns) {
        setReturns(data.returns);
      } else {
        setReturns([]);
      }
    } catch (error) {
      toast.error("Failed to load your returns");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchReturns();
  }, [userId]);

  // Filtering Logic
  const filteredReturns = returns.filter((item) => {
    const matchesInvoice = item.Sale?.invoice_number
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = statusFilter === "" || item.status === statusFilter;
    return matchesInvoice && matchesStatus;
  });

  // Stats for the top cards
  const stats = {
    total: filteredReturns.length,
    pending: filteredReturns.filter((r) => r.status === "PENDING").length,
    approved: filteredReturns.filter((r) => r.status === "APPROVED").length,
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* HEADER & REFRESH */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">My Returns</h3>
          <p className="text-gray-500 text-xs mt-1">
            Status of your submitted return requests
          </p>
        </div>
        <button
          onClick={fetchReturns}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-semibold transition shadow-sm"
        >
          <RotateCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-4 gap-3 mb-1">
        <div className="bg-white rounded-xl shadow-sm p-1 border border-gray-100 text-center">
          <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">
            Total
          </p>
          <p className="text-xl font-black text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-1 border border-gray-100 text-center">
          <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">
            Pending
          </p>
          <p className="text-xl font-black text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-1 border border-gray-100 text-center">
          <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">
            Aproved
          </p>
          <p className="text-xl font-black text-yellow-600">{stats.approved}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-1 border border-gray-100 text-center">
          <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">
            Rejected
          </p>
          <p className="text-xl font-black text-red-600">
            {stats.rejected || "None"}
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-1 text-gray-500 rounded-xl shadow-sm mb-1 grid grid-cols-1 md:grid-cols-2 gap-3 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Invoice #"
            className="w-full pl-9 h-9 text-xs border rounded-lg bg-gray-50 outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 text-xs border rounded-lg bg-gray-50 px-3 outline-none"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
          <p className="text-xs text-gray-400">Loading returns...</p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                <tr>
                  <th className="px-6 py-4 text-left">Invoice</th>
                  <th className="px-6 py-4 text-left">Refunded Item</th>
                  <th className="px-6 py-4 text-center">Qty</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-600">
                {filteredReturns.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-bold">
                      {item.Sale?.invoice_number}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setPreviewReturn(item);
                          setIsPreviewOpen(true);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 underline decoration-dotted font-medium text-left"
                      >
                        {/* Find specific product name from included SaleItems */}
                        {item.Sale?.SaleItems?.find(
                          (si) => si.id === item.Sale_item_id,
                        )?.product_name || "View Item"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-xs text-center font-bold">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black ${
                          item.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : item.status === "APPROVED"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE GRID VIEW */}
          <div className="md:hidden grid grid-cols-1 gap-3">
            {filteredReturns.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-gray-800">
                    {item.Sale?.invoice_number}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setPreviewReturn(item);
                    setIsPreviewOpen(true);
                  }}
                  className="text-xs text-blue-600 font-medium underline decoration-dotted"
                >
                  {item.Sale?.SaleItems?.find(
                    (si) => si.id === item.Sale_item_id,
                  )?.product_name || "View Item"}
                </button>
                <div className="flex justify-between items-center text-[10px] text-gray-400 mt-3 pt-3 border-t">
                  <span>Qty: {item.quantity}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredReturns.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-400 text-sm italic">
                No return requests found.
              </p>
            </div>
          )}
        </>
      )}

      {/* ITEM PREVIEW MODAL */}
      {isPreviewOpen && previewReturn && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden border border-gray-100">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-2">
                <List className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-xs text-gray-800 uppercase tracking-tight">
                  Refund Details
                </h3>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="p-2 bg-blue-500 rounded-md text-white">
                  <Hash className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-blue-600 font-bold uppercase">
                    Refunded Quantity
                  </p>
                  <p className="text-xl font-black text-blue-900">
                    {previewReturn.quantity}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    Product Name
                  </label>
                  <p className="text-sm font-semibold text-gray-800">
                    {previewReturn.Sale?.SaleItems?.find(
                      (si) => si.id === previewReturn.Sale_item_id,
                    )?.product_name || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Return Reason
                  </label>
                  <p className="text-xs text-gray-600 italic bg-gray-50 p-3 rounded border border-gray-100 mt-1">
                    "{previewReturn.reason || "No reason specified"}"
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50 flex justify-center">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="w-full py-2.5 bg-gray-800 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-gray-700 transition tracking-widest"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Returns;
