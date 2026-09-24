import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Search,
  Loader2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  Package,
  AlertTriangle,
  Clock,
  TrendingDown,
} from "lucide-react";
import { getProductsWithBatches } from "../../../utils/product.util";
import { getAllCategories } from "../../../utils/category.util";

const ITEMS_PER_PAGE = 20;

const ProductBatches = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [expandedIds, setExpandedIds] = useState(new Set());

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  /* ============ FETCH CATEGORIES ============ */
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getAllCategories();
      setCategories(Array.isArray(res?.data) ? res.data : []);
    };
    fetchCategories();
  }, []);

  /* ============ FETCH PRODUCTS WITH BATCHES ============ */
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getProductsWithBatches({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: search || undefined,
        category_id: categoryId !== "all" ? categoryId : undefined,
        status: status !== "all" ? status : undefined,
      });
      if (res?.success) {
        setProducts(res.data || []);
        setTotal(res.pagination?.total || 0);
      }
    } catch (err) {
      toast.error("Failed to load batches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchData, 300); // debounce search
    return () => clearTimeout(timer);
  }, [currentPage, search, categoryId, status]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(products.map((p) => p.id)));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  const resetFilters = () => {
    setSearch("");
    setCategoryId("all");
    setStatus("all");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="p-3 md:p-4 max-w-full text-gray-800 mx-auto min-h-screen bg-gray-50/50">
      {/* HEADER */}
      <div className="mb-5">
        <h2 className="text-lg font-black text-gray-900 tracking-tight">
          Batches by Product
        </h2>
        <p className="text-xs text-gray-500 font-medium">
          Search a product to see all its stock batches and expiry info
        </p>
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none"
        >
          <option value="all">All Products</option>
          <option value="has_active">Has Active Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="expiring_soon">Has Expiring Soon</option>
          <option value="expired">Has Expired</option>
        </select>

        <button
          onClick={resetFilters}
          className="w-full py-2 text-xs font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-3 h-3" /> Reset Filters
        </button>
      </div>

      {/* QUICK ACTIONS */}
      {!loading && products.length > 0 && (
        <div className="flex justify-end gap-2 mb-3">
          <button
            onClick={expandAll}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider"
          >
            Expand All
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={collapseAll}
            className="text-[11px] font-bold text-gray-500 hover:text-gray-700 uppercase tracking-wider"
          >
            Collapse All
          </button>
        </div>
      )}

      {/* CONTENT */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-24">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
            Loading Products...
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white p-20 text-center rounded-2xl border border-dashed border-gray-200">
          <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-bold">No products found</p>
          <p className="text-xs text-gray-400 mt-1">
            Try a different search or filter
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-3 items-start">
            {products.map((product) => (
              <ProductBatchGroup
                key={product.id}
                product={product}
                isExpanded={expandedIds.has(product.id)}
                onToggle={() => toggleExpand(product.id)}
              />
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
                Page {currentPage} of {totalPages} • {total} products
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

/* ============================================================
   PRODUCT ROW (Collapsed + Expanded)
============================================================ */
const ProductBatchGroup = ({ product, isExpanded, onToggle }) => {
  const hasAlerts =
    product.has_expired || product.has_expiring_soon || product.is_low_stock;

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border transition-all ${
        hasAlerts ? "border-amber-100" : "border-gray-100"
      }`}
    >
      {/* COLLAPSED ROW */}
      <button
        onClick={onToggle}
        className="w-full text-left p-4 hover:bg-gray-50/50 transition-colors flex items-center gap-3"
      >
        {/* Expand icon */}
        <div className="flex-shrink-0 text-gray-400">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRightIcon className="w-5 h-5" />
          )}
        </div>

        {/* Product info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-sm text-gray-900 truncate">
              {product.name}
            </h3>
            {product.has_expired && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-red-50 text-red-700">
                <AlertTriangle className="w-2.5 h-2.5" /> Expired
              </span>
            )}
            {product.has_expiring_soon && !product.has_expired && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-orange-50 text-orange-700">
                <Clock className="w-2.5 h-2.5" /> Expiring
              </span>
            )}
            {product.is_low_stock && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-yellow-50 text-yellow-700">
                <TrendingDown className="w-2.5 h-2.5" /> Low
              </span>
            )}
          </div>
          <p className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">
            {product.barcode}{" "}
            {product.category?.name && `• ${product.category.name}`}
          </p>
        </div>

        {/* Right side stats */}
        <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
          <div className="text-right">
            <p className="text-[9px] text-gray-400 uppercase font-bold">
              Batches
            </p>
            <p className="text-sm font-black text-gray-900">
              {product.active_batch_count}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-gray-400 uppercase font-bold">
              Units
            </p>
            <p className="text-sm font-black text-blue-600">
              {product.total_batch_stock}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-gray-400 uppercase font-bold">
              Avg Cost
            </p>
            <p className="text-xs font-bold text-gray-600">
              {product.average_cost.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Mobile compact stats */}
        <div className="sm:hidden flex-shrink-0 text-right">
          <p className="text-xs font-black text-blue-600">
            {product.total_batch_stock}
          </p>
          <p className="text-[9px] text-gray-400">
            {product.active_batch_count} b.
          </p>
        </div>
      </button>

      {/* EXPANDED: BATCH LIST */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50/50 p-3 sm:p-4 space-y-2">
          {product.batches.length === 0 ? (
            <p className="text-xs text-gray-400 italic text-center py-4">
              No batches exist for this product yet.
            </p>
          ) : (
            product.batches.map((batch) => (
              <BatchCard key={batch.id} batch={batch} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

/* ============================================================
   BATCH CARD
============================================================ */
const BatchCard = ({ batch }) => {
  const isActive = batch.stock_quantity > 0 && batch.is_active;

  return (
    <div
      className={`bg-white rounded-xl border p-3 ${
        batch.is_expired
          ? "border-red-100 bg-red-50/30"
          : batch.is_expiring_soon
            ? "border-orange-100 bg-orange-50/30"
            : "border-gray-100"
      }`}
    >
      {/* Top row: batch code + status */}
      <div className="flex justify-between items-start gap-2 mb-2">
        <p className="text-[10px] font-mono text-gray-500 truncate">
          {batch.batch_code}
        </p>
        <StatusBadge batch={batch} />
      </div>

      {/* Grid: qty, buy, sell, expiry */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        <div>
          <p className="text-[9px] text-gray-400 uppercase font-bold">Qty</p>
          <p
            className={`font-black ${
              isActive ? "text-gray-900" : "text-gray-400"
            }`}
          >
            {batch.stock_quantity}
          </p>
        </div>
        <div>
          <p className="text-[9px] text-gray-400 uppercase font-bold">Buy</p>
          <p className="font-bold text-gray-600">
            {Number(batch.buying_price).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[9px] text-gray-400 uppercase font-bold">Sell</p>
          <p className="font-bold text-emerald-600">
            {Number(batch.selling_price).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[9px] text-gray-400 uppercase font-bold">Expiry</p>
          <p
            className={`font-bold ${
              batch.is_expired
                ? "text-red-600"
                : batch.is_expiring_soon
                  ? "text-orange-600"
                  : "text-gray-600"
            }`}
          >
            {batch.expire_date
              ? new Date(batch.expire_date).toLocaleDateString()
              : "—"}
          </p>
        </div>
      </div>

      {/* Footer: received date + total value */}
      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50 text-[10px] text-gray-600">
        <span>
          Received:{" "}
          {new Date(batch.received_date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
        <span className="font-bold text-gray-500">
          Value:{" "}
          {(batch.stock_quantity * Number(batch.buying_price)).toLocaleString()}{" "}
          RWF
        </span>
      </div>
    </div>
  );
};

/* ============================================================
   STATUS BADGE
============================================================ */
const StatusBadge = ({ batch }) => {
  if (batch.stock_quantity === 0 || !batch.is_active) {
    return (
      <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase bg-gray-100 text-gray-500">
        Empty
      </span>
    );
  }
  if (batch.is_expired) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase bg-red-100 text-red-700">
        <AlertTriangle className="w-2.5 h-2.5" /> Expired
      </span>
    );
  }
  if (batch.is_expiring_soon) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase bg-orange-100 text-orange-700">
        <Clock className="w-2.5 h-2.5" /> Soon
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase bg-emerald-50 text-emerald-700">
      Active
    </span>
  );
};

export default ProductBatches;
