import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  Search,
  Loader2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertTriangle,
  Clock,
  ArrowUpDown,
} from "lucide-react";
import { getAllBatches } from "../.../../../../utils/product.util";

const ITEMS_PER_PAGE = 25;

const ProductBatches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [lowStock, setLowStock] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState("received_date");
  const [sortDir, setSortDir] = useState("desc");

  /* ============ FETCH ============ */
  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res = await getAllBatches({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        status,
        low_stock: lowStock ? "true" : undefined,
        sort_by: sortKey,
        sort_order: sortDir.toUpperCase(),
      });
      if (res?.success) {
        setBatches(res.data || []);
        setTotal(res.pagination?.total || 0);
      }
    } catch (err) {
      toast.error("Failed to load batches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [currentPage, status, lowStock, sortKey, sortDir]);

  /* ============ CLIENT-SIDE SEARCH ============ */
  const visibleBatches = useMemo(() => {
    if (!search) return batches;
    const q = search.toLowerCase();
    return batches.filter((b) =>
      [b.product?.name, b.product?.barcode, b.product?.sku, b.batch_code]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [batches, search]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setStatus("active");
    setLowStock(false);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="p-3 md:p-4 text-gray-800 max-w-full mx-auto min-h-screen bg-gray-50/50">
      {/* HEADER */}
      <div className="mb-5">
        <h2 className="text-lg font-black text-gray-900 tracking-tight">
          Product Batches
        </h2>
        <p className="text-xs text-gray-500 font-medium">
          Every physical batch of stock currently tracked in the system
        </p>
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search product, batch code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none"
        >
          <option value="all">All Batches</option>
          <option value="active">Active (In Stock)</option>
          <option value="inactive">Inactive (Empty)</option>
          <option value="expired">Expired</option>
          <option value="expiring_soon">Expiring Soon (30d)</option>
        </select>
        <label className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 cursor-pointer">
          <input
            type="checkbox"
            checked={lowStock}
            onChange={(e) => {
              setLowStock(e.target.checked);
              setCurrentPage(1);
            }}
            className="rounded"
          />
          <span className="text-gray-600 font-medium text-xs">
            Low Stock Only
          </span>
        </label>
        <button
          onClick={resetFilters}
          className="w-full py-2 text-xs font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-3 h-3" /> Reset Filters
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-24">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
            Loading Batches...
          </p>
        </div>
      ) : visibleBatches.length === 0 ? (
        <div className="bg-white p-20 text-center rounded-2xl border border-dashed border-gray-200">
          <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-bold">No batches found</p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr className="text-[11px] text-gray-500 uppercase font-bold">
                    <th className="text-left px-4 py-3">Product</th>
                    <th className="text-left px-4 py-3">Batch Code</th>
                    <th
                      className="text-right px-4 py-3 cursor-pointer select-none"
                      onClick={() => toggleSort("stock_quantity")}
                    >
                      <span className="flex items-center justify-end gap-1">
                        Qty <ArrowUpDown className="w-3 h-3" />
                      </span>
                    </th>
                    <th className="text-right px-4 py-3">Buy</th>
                    <th className="text-right px-4 py-3">Sell</th>
                    <th
                      className="text-left px-4 py-3 cursor-pointer select-none"
                      onClick={() => toggleSort("expire_date")}
                    >
                      <span className="flex items-center gap-1">
                        Expiry <ArrowUpDown className="w-3 h-3" />
                      </span>
                    </th>
                    <th className="text-center px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleBatches.map((b) => (
                    <tr
                      key={b.id}
                      className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-bold text-gray-900">
                          {b.product?.name}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          {b.product?.barcode}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[11px] font-mono text-gray-500">
                        {b.batch_code}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">
                        {b.stock_quantity}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-500 text-xs">
                        {Number(b.buying_price).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900 text-xs">
                        {Number(b.selling_price).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {b.expire_date ? (
                          <span
                            className={
                              b.is_expired
                                ? "text-red-600 font-bold"
                                : b.is_expiring_soon
                                  ? "text-orange-600 font-bold"
                                  : "text-gray-500"
                            }
                          >
                            {new Date(b.expire_date).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge batch={b} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE CARDS */}
          <div className="md:hidden space-y-3">
            {visibleBatches.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-gray-900 truncate">
                      {b.product?.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-mono">
                      {b.batch_code}
                    </p>
                  </div>
                  <StatusBadge batch={b} />
                </div>
                <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-gray-50 my-2 text-center">
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase font-bold">
                      Qty
                    </p>
                    <p className="text-sm font-black text-gray-900">
                      {b.stock_quantity}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase font-bold">
                      Buy
                    </p>
                    <p className="text-xs font-bold text-gray-600">
                      {Number(b.buying_price).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase font-bold">
                      Sell
                    </p>
                    <p className="text-xs font-bold text-emerald-600">
                      {Number(b.selling_price).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>
                    Received: {new Date(b.received_date).toLocaleDateString()}
                  </span>
                  {b.expire_date && (
                    <span
                      className={
                        b.is_expired
                          ? "text-red-600 font-bold"
                          : b.is_expiring_soon
                            ? "text-orange-600 font-bold"
                            : ""
                      }
                    >
                      Exp: {new Date(b.expire_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-5 bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40"
              >
                <ChevronLeft className="w-3 h-3" /> Prev
              </button>
              <span className="text-xs font-bold text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40"
              >
                Next <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

/* ============ SUB-COMPONENTS ============ */
const StatusBadge = ({ batch }) => {
  if (batch.stock_quantity === 0) {
    return (
      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase bg-gray-100 text-gray-500">
        Empty
      </span>
    );
  }
  if (batch.is_expired) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase bg-red-50 text-red-700">
        <AlertTriangle className="w-3 h-3" /> Expired
      </span>
    );
  }
  if (batch.is_expiring_soon) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase bg-orange-50 text-orange-700">
        <Clock className="w-3 h-3" /> Soon
      </span>
    );
  }
  if (batch.is_low_stock) {
    return (
      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase bg-yellow-50 text-yellow-700">
        Low
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase bg-emerald-50 text-emerald-700">
      Active
    </span>
  );
};

export default ProductBatches;
