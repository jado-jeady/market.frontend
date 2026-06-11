import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllCategories } from "../../../utils/category.util";
import { fetchBaristaItems } from "../../../utils/product.util";
import StockAdjustmentModal from "../Stock/StockAdjustmentModal";
import EditProductModal from "./EditProduct";
import {
  Download,
  Search,
  Loader2,
  Eye,
  Package,
  X,
  RotateCcw,
  Plus,
} from "lucide-react";

const ITEMS_PER_PAGE = 12;

const AdminiBaristaList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [productToView, setProductToView] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [stockLevel, setStockLevel] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch only Barista items from utility
  const fetchBaristaData = async () => {
    try {
      setLoading(true);
      const data = await fetchBaristaItems();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (err) {
      toast.error("Error fetching barista items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getAllCategories();
      setCategories(Array.isArray(res?.data) ? res.data : []);
    };
    fetchCategories();
    fetchBaristaData();
  }, []);

  // Filter items matching search queries or specific category definitions
  const filteredProducts = useMemo(() => {
    let data = [...products];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((p) =>
        [p.name, p.barcode, p.sku].join(" ").toLowerCase().includes(q),
      );
    }
    // Accounts for both embedded objects (p.category.id) and explicit references (p.category_id)
    if (category !== "all") {
      data = data.filter(
        (p) =>
          String(p.category?.id) === category ||
          String(p.category_id) === category,
      );
    }
    if (stockLevel !== "all") {
      data = data.filter((p) => {
        if (stockLevel === "in") return p.stock_quantity > p.min_stock;
        if (stockLevel === "low")
          return p.stock_quantity > 0 && p.stock_quantity <= p.min_stock;
        if (stockLevel === "out") return p.stock_quantity === 0;
        return true;
      });
    }
    return data;
  }, [products, search, category, stockLevel]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, stockLevel]);

  return (
    <div className="p-2 md:p-2 lg:p-3 max-w-[1000px] mx-auto min-h-screen bg-gray-50/50">
      {/* RESPONSIVE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Barista Inventory
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Manage your coffees, teas, and baristary products
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            to="/admin/products/add"
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-md"
          >
            <Plus className="w-4 h-4 mr-1 text-white" />{" "}
            <span className="text-white">Add Barista Item</span>
          </Link>
          <button
            onClick={() => toast.info("Exporting barista items...")}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-all shadow-md"
          >
            Excel <Download className="ml-2 w-4 h-4" />
          </button>
        </div>
      </div>

      {/* RESPONSIVE FILTERS */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-3 mb-6 text-gray-900 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search barista items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
          value={stockLevel}
          onChange={(e) => setStockLevel(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none"
        >
          <option value="all">Stock Status</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
        <button
          onClick={() => {
            setSearch("");
            setCategory("all");
            setStockLevel("all");
          }}
          className="w-full py-2 text-xs font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-3 h-3" /> Reset Filters
        </button>
      </div>

      {/* DYNAMIC GRID */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
              Syncing Barista Records...
            </p>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="bg-white p-20 text-center rounded-2xl border border-dashed border-gray-200 shadow-sm">
            <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-bold">No barista items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 lg:gap-6">
            {paginatedProducts.map((p) => {
              let stockStatus, stockColor;
              if (p.stock_quantity === 0) {
                stockStatus = "Out of Stock";
                stockColor = "text-red-600 bg-red-50";
              } else if (p.stock_quantity <= p.min_stock) {
                stockStatus = "Low Stock";
                stockColor = "text-orange-600 bg-orange-50";
              } else {
                stockStatus = "In Stock";
                stockColor = "text-emerald-600 bg-emerald-50";
              }

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col p-4 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span
                      className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${stockColor}`}
                    >
                      {stockStatus}
                    </span>
                    <button
                      onClick={() => {
                        setProductToView(p);
                        setIsViewOpen(true);
                      }}
                      className="p-1.5 text-gray-300 hover:text-blue-600 bg-gray-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-bold text-sm text-gray-900 truncate mb-1 group-hover:text-blue-600 transition-colors">
                      {p.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-mono tracking-tighter uppercase">
                      {p.barcode || "No Barcode"}
                    </p>
                  </div>
                  <div className="space-y-2 mb-6 text-xs border-t border-gray-50 pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Price:</span>
                      <span className="font-bold text-gray-900">
                        {Number(p.selling_price).toLocaleString()} RWF
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Stock:</span>
                      <span className="font-bold text-gray-900">
                        {p.stock_quantity} units
                      </span>
                    </div>
                  </div>
                  <div className="mt-auto flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setProductToEdit(p);
                        setIsEditModalOpen(true);
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProduct(p);
                        setIsAdjustOpen(true);
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-all"
                    >
                      Adjust Stock
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {filteredProducts.length > ITEMS_PER_PAGE && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {Array.from(
            { length: Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) },
            (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ),
          )}
        </div>
      )}

      {/* MODALS */}
      <StockAdjustmentModal
        isOpen={isAdjustOpen}
        onClose={() => setIsAdjustOpen(false)}
        product={selectedProduct}
        refreshProducts={fetchBaristaData}
      />
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={productToEdit}
        refreshProducts={fetchBaristaData}
      />
      {/* ViewProductModal would be similar to EditProductModal but with read-only fields */}
    </div>
  );
};

export default AdminiBaristaList;
