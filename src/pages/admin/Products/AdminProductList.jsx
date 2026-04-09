import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllCategories } from "../../../utils/category.util";
import {
  exportProductsToExcel,
  getAllProducts,
} from "../../../utils/product.util";
import StockAdjustmentModal from "../Stock/StockAdjustmentModal";
import EditProductModal from "./EditProduct";
import {
  Download,
  Search,
  Filter,
  Loader2,
  Eye,
  Edit,
  Package,
  X,
  RotateCcw,
  Plus,
} from "lucide-react";

const ITEMS_PER_PAGE = 12;

const AdminiProductList = () => {
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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getAllProducts({ limit: 1000000 });
      if (res?.success) setProducts(res.data);
    } catch (err) {
      toast.error("Error fetching products");
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
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let data = [...products];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((p) =>
        [p.name, p.barcode, p.sku].join(" ").toLowerCase().includes(q),
      );
    }
    if (category !== "all")
      data = data.filter((p) => String(p.category?.id) === category);
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
    <div className="p-4 md:p-6 lg:p-8 max-w-[2000px] mx-auto min-h-screen bg-gray-50/50">
      {/* RESPONSIVE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Inventory
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Manage your products and stock levels
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            to="/admin/products/add"
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold text-  bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-md"
          >
            <Plus className="w-4 h-4 mr-1 text-white" />{" "}
            <span className="text-white">Add Product</span>
          </Link>
          <button
            onClick={exportProductsToExcel}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-all shadow-md"
          >
            Excel <Download className="ml-2 w-4 h-4" />
          </button>
        </div>
      </div>

      {/* RESPONSIVE FILTERS */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-1 mb-2 text-gray-900 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
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
              Syncing Records...
            </p>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="bg-white p-20 text-center rounded-2xl border border-dashed border-gray-200 shadow-sm">
            <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium font-bold">
              No products found
            </p>
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
                  <div className="mt-auto grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setProductToEdit(p);
                        setIsEditModalOpen(true);
                      }}
                      className="py-2.5 bg-gray-50 text-gray-600 text-[10px] font-bold uppercase rounded-xl hover:bg-gray-100 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProduct(p);
                        setIsAdjustOpen(true);
                      }}
                      className="py-2.5 bg-blue-600 text-white text-[10px] font-bold uppercase rounded-xl hover:bg-blue-700 transition-all shadow-sm"
                    >
                      Stock
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* VIEW MODAL - Fully Responsive Layout */}
      {isViewOpen && productToView && (
        <div className="fixed inset-0 z-50 flex  items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-2">
          <div className="bg-white rounded-t-xl z-50 mt-20 sm:rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden relative flex flex-col animate-in slide-in-from-bottom duration-300">
            <button
              onClick={() => setIsViewOpen(false)}
              className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors hidden sm:block"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="overflow-y-auto flex-1">
              <div className="bg-gray-900 p-1 sm:p-4 text-white relative">
                <button
                  onClick={() => setIsViewOpen(false)}
                  className="absolute top-4 right-4 sm:hidden"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${productToView.is_active ? "bg-emerald-500" : "bg-red-500"}`}
                  >
                    {productToView.is_active ? "Active" : "Inactive"}
                  </span>
                  <span className="bg-blue-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                    {productToView.product_type}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight">
                  {productToView.name}
                </h3>
                <p className="text-[10px] text-gray-400 font-mono mt-2 break-all">
                  {productToView.sku}
                </p>
              </div>
              <div className="p-1 sm:p-1">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-3">
                  <StatCard
                    label="Inventory"
                    val={productToView.stock_quantity}
                    color={
                      productToView.stock_quantity <= productToView.min_stock
                        ? "text-red-600"
                        : "text-blue-600"
                    }
                  />
                  <StatCard
                    label="Price"
                    val={`${Number(productToView.selling_price).toLocaleString()} RWF`}
                    color="text-emerald-600"
                  />
                  <StatCard
                    label="Expiry"
                    val={
                      productToView.expire_date
                        ? new Date(
                            productToView.expire_date,
                          ).toLocaleDateString()
                        : "N/A"
                    }
                    color="text-orange-600"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 mb-2 gap-y-3 md:gap-x-12">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b  pb-2">
                      Specs
                    </h4>
                    <DetailRow label="Barcode" val={productToView.barcode} />
                    <DetailRow
                      label="Category"
                      val={productToView.category?.name}
                    />
                    <DetailRow
                      label="Min. Alert"
                      val={`${productToView.min_stock} units`}
                    />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2">
                      Supply
                    </h4>
                    <DetailRow label="Supplier" val={productToView.supplier} />
                    <DetailRow
                      label="Buying Price"
                      val={`${Number(productToView.buying_price).toLocaleString()} RWF`}
                    />
                    <DetailRow
                      label="Added On"
                      val={new Date(
                        productToView.createdAt,
                      ).toLocaleDateString()}
                    />
                  </div>
                </div>
                <div className="mt-3 p-1 text-gray-300 bg-gray-100 rounded-lg border border-gray-100 italic text-xs text-gray-600 leading-relaxed">
                  <p className="font-black text-gray-800">Description</p>
                  {`"${productToView.description || "No description available"}" `}
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t sm:p-6">
              <button
                onClick={() => setIsViewOpen(false)}
                className="w-full py-4 bg-gray-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* External Components */}
      {isAdjustOpen && (
        <StockAdjustmentModal
          isOpen={isAdjustOpen}
          onClose={() => setIsAdjustOpen(false)}
          product={selectedProduct}
          refresh={fetchProducts}
        />
      )}
      {isEditModalOpen && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          product={productToEdit}
          refresh={fetchProducts}
        />
      )}
    </div>
  );
};

const StatCard = ({ label, val, color }) => (
  <div className="bg-gray-200 p-2 rounded-sm text-center border border-gray-100 flex flex-row sm:flex-col justify-between items-center sm:items-center">
    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
      {label}
    </span>
    <p className={`text-sm sm:text-base font-black ${color}`}>{val}</p>
  </div>
);

const DetailRow = ({ label, val }) => (
  <div className="flex justify-between items-center text-xs">
    <span className="text-gray-400 font-medium">{label}:</span>
    <span className="font-bold text-gray-800">{val || "N/A"}</span>
  </div>
);

export default AdminiProductList;
