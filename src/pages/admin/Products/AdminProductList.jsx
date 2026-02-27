import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllCategories } from "../../../utils/category.util";
import { getAllProducts } from "../../../utils/product.util";
import StockAdjustmentModal from "../Stock/StockAdjustmentModal";
import EditProductModal from "./EditProduct";

const ITEMS_PER_PAGE = 12; // Increased slightly for larger screens

const AdminiProductList = () => {
  /* ===================== STATE ===================== */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [stockLevel, setStockLevel] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  /* ===================== FETCH DATA ===================== */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getAllProducts({ limit: 1000000 });
      if (res?.success) {
        setProducts(res.data);
      } else {
        toast.error(res?.message || "Failed to load products");
      }
    } catch (err) {
      toast.error("Error fetching products");
      console.log(err)
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

  /* ===================== MODAL HANDLERS ===================== */
  const openAdjustModal = (product) => {
    setSelectedProduct(product);
    setIsAdjustOpen(true);
  };

  const openEditModal = (product) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
  };

  /* ===================== FILTER LOGIC ===================== */
  const filteredProducts = useMemo(() => {
    let data = [...products];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((p) =>
        [p.name, p.barcode, p.sku, p.selling_price?.toString()]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }
    if (category !== "all") {
      data = data.filter((p) => String(p.category?.id) === category);
    }
    if (stockLevel !== "all") {
      data = data.filter((p) => {
        if (stockLevel === "in") return p.stock_quantity > p.min_stock;
        if (stockLevel === "low") return p.stock_quantity > 0 && p.stock_quantity <= p.min_stock;
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

  /* ===================== UI RENDER ===================== */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-12 w-12 border-b-2 border-gray-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 lg:p-8 max-w-[1600px] 2xl:max-w-[2000px] mx-auto transition-all duration-300">
      
      {/* HEADER SECTION */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-xl lg:text-xl font-bold text-gray-900 tracking-tight">Products</h2>
          <p className="text-xs sm:text-xs lg:text-base text-gray-600">Search, filter & manage inventory</p>
        </div>
        <Link
          to="/admin/products/add"
          className="px-4 py-2 lg:px-6 lg:text-white md:text-white lg:py-3 text-xs lg:text-base text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all whitespace-nowrap"
        >
          + Add Product
        </Link>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-3 lg:p-1 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
          <input
            type="text"
            placeholder="Search name, barcode, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-2 py-2 h-10 lg:h-10 w-full text-gray-700 text-xs lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-2 py-2 h-10 lg:h-10 w-full text-gray-700 text-xs lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {[...new Map(categories.map((p) => [p.id, p])).values()]
              .filter(Boolean)
              .map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
          </select>

          <select
            value={stockLevel}
            onChange={(e) => setStockLevel(e.target.value)}
            className="px-2 py-2 h-10 lg:h-10 w-full text-gray-700 text-xs lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Stock Levels</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>

          <button
            onClick={() => { setSearch(""); setCategory("all"); setStockLevel("all"); }}
            className="px-2 py-2 h-10 lg:h-10 w-full text-gray-700 text-xs lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* PRODUCTS GRID (Scaling for 2K/4K) */}
      {paginatedProducts.length === 0 ? (
        <div className="bg-white p-20 text-center rounded-xl shadow-sm border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No products match your current filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4 lg:gap-6 xl:gap-8">
          {paginatedProducts.map((p) => {
            let stockStatus, stockColor;
            if (p.stock_quantity === 0) {
              stockStatus = "No Stock"; stockColor = "text-red-600 bg-red-50";
            } else if (p.stock_quantity <= p.min_stock) {
              stockStatus = "Low Stock"; stockColor = "text-amber-600 bg-amber-50";
            } else {
              stockStatus = "In Stock"; stockColor = "text-emerald-600 bg-emerald-50";
            }

            return (
              <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col group h-full">
                {/* Visual Icon Area */}
                <div className="h-20 lg:h-28 bg-gray-50 flex items-center justify-center rounded-t-xl group-hover:bg-blue-50 transition-colors">
                  <svg xmlns="http://www.w3.org" className="w-8 h-8 lg:w-12 lg:h-12 text-blue-500 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>

                <div className="p-4 lg:p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm lg:text-base text-gray-800 truncate">{p.name}</h4>
                      <p className="text-[10px] lg:text-xs text-gray-400 font-mono mt-0.5">{p.barcode || 'N/A'}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] lg:text-xs font-bold uppercase tracking-wider ${stockColor}`}>
                      {stockStatus}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4 text-xs lg:text-sm text-gray-600">
                    <div className="flex justify-between border-b border-gray-50 pb-1">
                      <span>Price:</span>
                      <span className="font-semibold text-gray-900">${Number(p.selling_price || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-1">
                      <span>Stock:</span>
                      <span className="font-semibold">{p.stock_quantity} units</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-auto pt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="text-[10px] lg:text-xs font-semibold py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openAdjustModal(p)}
                      className="text-[10px] lg:text-xs font-semibold py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Stock
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODALS */}
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

export default AdminiProductList;
