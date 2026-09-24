import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Search,
  Loader2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Clock,
  Download,
  Calendar,
} from "lucide-react";
import { getExpiryReport } from "../../../utils/product.util";
import { getAllCategories } from "../../../utils/category.util";

const ITEMS_PER_PAGE = 50;

const RANGE_TABS = [
  { key: "expired", label: "Expired", color: "red" },
  { key: "7", label: "≤ 7 Days", color: "orange" },
  { key: "30", label: "≤ 30 Days", color: "yellow" },
  { key: "90", label: "≤ 90 Days", color: "gray" },
  { key: "all", label: "All Expiring", color: "blue" },
];

const ExpiryReportPage = () => {
  const [batches, setBatches] = useState([]);
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [range, setRange] = useState("30");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchCats = async () => {
      const res = await getAllCategories();
      setCategories(Array.isArray(res?.data) ? res.data : []);
    };
    fetchCats();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getExpiryReport({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        range,
        search: search || undefined,
        category_id: categoryId !== "all" ? categoryId : undefined,
      });
      if (res?.success) {
        setBatches(res.data || []);
        setSummary(res.summary || null);
        setTotal(res.pagination?.total || 0);
      }
    } catch (err) {
      toast.error("Failed to load expiry report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [currentPage, range, search, categoryId]);

  const resetFilters = () => {
    setSearch("");
    setCategoryId("all");
    setRange("30");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="p-3 md:p-4 max-w-full text-gray-800 mx-auto min-h-full bg-gray-50/50">
      {/* HEADER */}
      <div className="mb-5">
        <h2 className="text-lg font-black text-gray-900 tracking-tight">
          Expiry Report
        </h2>
        <p className="text-xs text-gray-500 font-medium">
          Batches that are expired or expiring soon — take action before loss
        </p>
      </div>

      {/* SUMMARY CARDS */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <SummaryCard
            label="Expired"
            count={summary.expired_count}
            value={summary.expired_value}
            color="text-red-600"
            bg="bg-red-50"
          />
          <SummaryCard
            label="Expiring ≤ 7 days"
            count={summary.in_7d_count}
            value={summary.in_7d_value}
            color="text-orange-600"
            bg="bg-orange-50"
          />
          <SummaryCard
            label="Expiring ≤ 30 days"
            count={summary.in_30d_count}
            value={summary.in_30d_value}
            color="text-yellow-600"
            bg="bg-yellow-50"
          />
          <SummaryCard
            label="Total at Risk"
            count={summary.total_batches}
            value={summary.total_value}
            color="text-gray-700"
            bg="bg-gray-100"
          />
        </div>
      )}

      {/* RANGE TABS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-4 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {RANGE_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setRange(tab.key);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                range === tab.key
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          onClick={resetFilters}
          className="w-full py-2 text-xs font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-3 h-3" /> Reset Filters
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-24">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
            Loading Report...
          </p>
        </div>
      ) : batches.length === 0 ? (
        <div className="bg-white p-20 text-center rounded-2xl border border-dashed border-gray-200">
          <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-bold">
            No items {range === "expired" ? "expired" : "expiring"} in this
            range
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {range === "expired"
              ? "Great — everything is fresh!"
              : "Try a wider range or a different filter"}
          </p>
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
                    <th className="text-left px-4 py-3">Batch</th>
                    <th className="text-right px-4 py-3">Qty</th>
                    <th className="text-left px-4 py-3">Expiry</th>
                    <th className="text-center px-4 py-3">Days Left</th>
                    <th className="text-right px-4 py-3">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map((b) => (
                    <tr
                      key={b.id}
                      className={`border-b border-gray-50 ${
                        b.is_expired ? "bg-red-50/30" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="font-bold text-gray-900">
                          {b.product?.name}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          {b.product?.barcode}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[10px] font-mono text-gray-500">
                        {b.batch_code}
                      </td>
                      <td className="px-4 py-3 text-right font-bold">
                        {b.stock_quantity}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {new Date(b.expire_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <DaysBadge
                          days={b.days_left}
                          isExpired={b.is_expired}
                        />
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-gray-700">
                        {b.total_value.toLocaleString()} RWF
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE CARDS */}
          <div className="md:hidden space-y-3">
            {batches.map((b) => (
              <div
                key={b.id}
                className={`bg-white rounded-2xl shadow-sm border p-4 ${
                  b.is_expired
                    ? "border-red-200 bg-red-50/30"
                    : "border-gray-100"
                }`}
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
                  <DaysBadge days={b.days_left} isExpired={b.is_expired} />
                </div>
                <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-gray-50 my-2 text-center">
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase font-bold">
                      Qty
                    </p>
                    <p className="text-sm font-black">{b.stock_quantity}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase font-bold">
                      Expires
                    </p>
                    <p className="text-xs font-bold text-gray-600">
                      {new Date(b.expire_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase font-bold">
                      Value
                    </p>
                    <p className="text-xs font-bold text-gray-700">
                      {b.total_value.toLocaleString()}
                    </p>
                  </div>
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
                Page {currentPage} of {totalPages} • {total} batches
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
const SummaryCard = ({ label, count, value, color, bg }) => (
  <div className={`rounded-2xl shadow-sm border border-gray-100 p-4 ${bg}`}>
    <p className="text-[10px] text-gray-600 uppercase font-black tracking-wider mb-1">
      {label}
    </p>
    <p className={`text-2xl font-black ${color}`}>{count}</p>
    <p className="text-[10px] text-gray-500 mt-1">
      {Number(value).toLocaleString()} RWF
    </p>
  </div>
);

const DaysBadge = ({ days, isExpired }) => {
  if (isExpired) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase bg-red-100 text-red-700">
        <AlertTriangle className="w-3 h-3" /> Expired
      </span>
    );
  }
  if (days === null || days === undefined) {
    return <span className="text-xs text-gray-400">—</span>;
  }
  if (days <= 7) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase bg-orange-100 text-orange-700">
        <Clock className="w-3 h-3" /> {days}d
      </span>
    );
  }
  if (days <= 30) {
    return (
      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase bg-yellow-100 text-yellow-700">
        {days}d
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase bg-gray-100 text-gray-600">
      {days}d
    </span>
  );
};

export default ExpiryReportPage;
