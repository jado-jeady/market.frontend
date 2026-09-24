import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  Search,
  Filter,
  Loader2,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import {
  getAllPriceChanges,
  getPriceChangeSummary,
} from "../../../utils/product.util";

const ITEMS_PER_PAGE = 25;

const PriceChanges = () => {
  const [changes, setChanges] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [changeType, setChangeType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState("created_at");
  const [sortDir, setSortDir] = useState("desc");

  /* ============ FETCH ============ */
  const fetchChanges = async () => {
    setLoading(true);
    try {
      const res = await getAllPriceChanges({
        limit: ITEMS_PER_PAGE,
        offset: (currentPage - 1) * ITEMS_PER_PAGE,
        change_type: changeType !== "all" ? changeType : undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      });
      if (res?.success) {
        setChanges(res.data || []);
        setTotal(res.total || 0);
      }
    } catch (err) {
      toast.error("Failed to load price changes");
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await getPriceChangeSummary(30);
      if (res?.success) setSummary(res.data);
    } catch (err) {
      // silent
    }
  };

  useEffect(() => {
    fetchChanges();
  }, [currentPage, changeType, startDate, endDate]);

  useEffect(() => {
    fetchSummary();
  }, []);

  /* ============ CLIENT-SIDE SEARCH + SORT ============ */
  const visibleChanges = useMemo(() => {
    let data = [...changes];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter((c) =>
        [
          c.product?.name,
          c.product?.barcode,
          c.product?.sku,
          c.changedBy?.full_name,
          c.change_reason,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }

    data.sort((a, b) => {
      let av = a[sortKey];
      let bv = b[sortKey];
      if (sortKey === "product_name") {
        av = a.product?.name || "";
        bv = b.product?.name || "";
      }
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [changes, search, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const resetFilters = () => {
    setSearch("");
    setChangeType("all");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="p-3 md:p-4 max-w-full text-gray-800 mx-auto min-h-screen bg-gray-50/50">
      {/* HEADER */}
      <div className="mb-5">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Price Changes
        </h1>
        <p className="text-xs text-gray-500 font-medium">
          History of every selling price change across products
        </p>
      </div>

      {/* SUMMARY CARDS */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <SummaryCard
            label="Changes (30d)"
            value={summary.total_changes}
            color="text-blue-600"
          />
          <SummaryCard
            label="Increases"
            value={
              summary.changes_by_type?.find((t) => t.change_type === "INCREASE")
                ?.count || 0
            }
            color="text-emerald-600"
          />
          <SummaryCard
            label="Decreases"
            value={
              summary.changes_by_type?.find((t) => t.change_type === "DECREASE")
                ?.count || 0
            }
            color="text-red-600"
          />
          <SummaryCard
            label="Total Events"
            value={summary.recent_changes?.length || 0}
            color="text-purple-600"
          />
        </div>
      )}

      {/* FILTERS */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search product, user, reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <select
          value={changeType}
          onChange={(e) => {
            setChangeType(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none"
        >
          <option value="all">All Types</option>
          <option value="INCREASE">Increase</option>
          <option value="DECREASE">Decrease</option>
          <option value="UPDATE">Update</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none"
        />
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
            Loading History...
          </p>
        </div>
      ) : visibleChanges.length === 0 ? (
        <div className="bg-white p-20 text-center rounded-2xl border border-dashed border-gray-200">
          <Filter className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-bold">No price changes found</p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr className="text-[11px] text-gray-500 uppercase font-bold">
                    <th
                      className="text-left px-4 py-3 cursor-pointer select-none"
                      onClick={() => toggleSort("product_name")}
                    >
                      <span className="flex items-center gap-1">
                        Product <ArrowUpDown className="w-3 h-3" />
                      </span>
                    </th>
                    <th className="text-right px-4 py-3">Old Price</th>
                    <th className="text-right px-4 py-3">New Price</th>
                    <th className="text-right px-4 py-3">Diff</th>
                    <th className="text-center px-4 py-3">Type</th>
                    <th
                      className="text-left px-4 py-3 cursor-pointer select-none"
                      onClick={() => toggleSort("changed_by")}
                    >
                      <span className="flex items-center gap-1">
                        Changed By <ArrowUpDown className="w-3 h-3" />
                      </span>
                    </th>
                    <th
                      className="text-left px-4 py-3 cursor-pointer select-none"
                      onClick={() => toggleSort("created_at")}
                    >
                      <span className="flex items-center gap-1">
                        Date <ArrowUpDown className="w-3 h-3" />
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleChanges.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-bold text-gray-900">
                          {c.product?.name || "—"}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          {c.product?.barcode}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-500">
                        {Number(c.old_price).toLocaleString()} RWF
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">
                        {Number(c.new_price).toLocaleString()} RWF
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-bold ${
                          c.change_type === "INCREASE"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {c.change_type === "INCREASE" ? "+" : ""}
                        {Number(c.price_difference).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <TypeBadge type={c.change_type} />
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {c.changedBy?.full_name || "System"}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(c.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE CARDS */}
          <div className="md:hidden space-y-3">
            {visibleChanges.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-gray-900 truncate">
                      {c.product?.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-mono">
                      {c.product?.barcode}
                    </p>
                  </div>
                  <TypeBadge type={c.change_type} />
                </div>
                <div className="flex items-center justify-between py-2 border-t border-b border-gray-50 my-2">
                  <div className="text-center">
                    <p className="text-[9px] text-gray-400 uppercase font-bold">
                      From
                    </p>
                    <p className="text-sm text-gray-500 line-through">
                      {Number(c.old_price).toLocaleString()}
                    </p>
                  </div>
                  <div
                    className={`text-xs font-black ${
                      c.change_type === "INCREASE"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {c.change_type === "INCREASE" ? "+" : ""}
                    {Number(c.price_difference).toLocaleString()}
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] text-gray-400 uppercase font-bold">
                      To
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {Number(c.new_price).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>👤 {c.changedBy?.full_name || "System"}</span>
                  <span>{new Date(c.created_at).toLocaleDateString()}</span>
                </div>
                {c.change_reason && (
                  <p className="mt-2 text-[11px] text-gray-600 italic bg-gray-50 rounded-lg p-2">
                    "{c.change_reason}"
                  </p>
                )}
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
const SummaryCard = ({ label, value, color }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
    <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1">
      {label}
    </p>
    <p className={`text-2xl font-black ${color}`}>{value}</p>
  </div>
);

const TypeBadge = ({ type }) => {
  if (type === "INCREASE") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase bg-emerald-50 text-emerald-700">
        <TrendingUp className="w-3 h-3" /> Inc
      </span>
    );
  }
  if (type === "DECREASE") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase bg-red-50 text-red-700">
        <TrendingDown className="w-3 h-3" /> Dec
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase bg-gray-100 text-gray-600">
      {type}
    </span>
  );
};

export default PriceChanges;
