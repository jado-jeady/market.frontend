import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllCategories } from "../../../utils/category.util";
import { getAllProducts } from "../../../utils/product.util";
import StockAdjustmentModal from "../Stock/StockAdjustmentModal";
import EditProductModal from "./EditProduct";

const ITEMS_PER_PAGE = 8;

const AdminiProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const openAdjustModal = (product) => {
    setSelectedProduct(product);
    setIsAdjustOpen(true);
  };

  const openEditModal = (product) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getAllCategories();
      setCategories(Array.isArray(res?.data) ? res.data : []);
    };
    fetchCategories();
  }, []);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [stockLevel, setStockLevel] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getAllProducts({ limit: 10000000000000 });
      if (res?.success) {
        setProducts(res.data);
      } else {
        toast.error(res?.message || "Failed to load products");
      }
    } catch (err) {
      toast.error("Error fetching products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
        if (stockLevel === "in") return p.stock_quantity > 50;
        if (stockLevel === "low") return p.stock_quantity > 0 && p.stock_quantity <= 50;
        if (stockLevel === "out") return p.stock_quantity === 0;
        return true;
      });
    }
    return data;
  }, [products, search, category, stockLevel]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, stockLevel]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 border-b-2 border-gray-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Products</h2>
          <p className="text-xs text-gray-600">Search, filter & manage inventory</p>
        </div>
        <Link
          to="/admin/products/add"
          className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 whitespace-nowrap"
        >
          + Add Product
        </Link>
      </div>

      {/* FILTERS */}
      <div className="bg-gray-100 border border-gray-200 rounded-lg shadow p-2 mb-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <input
            type="text"
            placeholder="Search by name, barcode, SKU, price..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-2 py-2 h-8 w-full text-gray-700 text-xs border rounded-lg focus:ring-2 focus:ring-gray-500"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-2 h-8 w-full text-gray-700 text-xs border rounded-lg focus:ring-2 focus:ring-gray-500"
          >
            <option value="all">All Categories</option>
            {[...new Map(categories.map((p) => [p.id, p])).values()]
              .filter(Boolean)
              .map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>

          <select
            value={stockLevel}
            onChange={(e) => setStockLevel(e.target.value)}
            className="px-2 h-8 w-full text-gray-700 text-xs border rounded-lg focus:ring-2 focus:ring-gray-500"
          >
            <option value="all">All Stock Levels</option>
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
            className="px-4 h-8 bg-white border border-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      {paginatedProducts.length === 0 ? (
        <div className="bg-white p-10 text-center rounded-lg shadow">
          <p className="text-gray-500">No products match your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedProducts.map((p) => {
            const stockStatus =
              p.stock_quantity > 50
                ? "In Stock"
                : p.stock_quantity > 0
                ? "Low Stock"
                : "No Stock";

            const stockColor =
              p.stock_quantity > 50
                ? "text-green-600"
                : p.stock_quantity > 0
                ? "text-yellow-600"
                : "text-red-600";

            return (
              <div
                key={p.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="h-16 bg-gray-100 flex items-center justify-center rounded-t-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={30}
                    height={30}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="blue"
                    strokeWidth={0.5}
                  >
                    <path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5v-9z" />
                    <path d="M12 3v18M3 7.5l9 4.5 9-4.5" />
                  </svg>
                </div>

                <div className="p-3 text-gray-500 text-xs">
                  <div className="flex justify-between items-start mb-2 gap-1">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-xs text-gray-800 truncate">{p.name}</h4>
                      <p className="text-[10px] text-gray-500 truncate">{p.barcode}</p>
                    </div>
                    <span className={`text-[10px] font-medium whitespace-nowrap ml-1 ${stockColor}`}>
                      {stockStatus}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 mb-3">
                    <div className="flex justify-between">
                      <span>Price</span>
                      <span className="font-semibold">{p.selling_price} RWF</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stock</span>
                      <span>{p.stock_quantity}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openAdjustModal(p)}
                      className="flex-1 bg-blue-100 text-blue-600 py-1.5 rounded text-xs hover:bg-blue-200 transition-colors"
                    >
                      Adjust
                    </button>
                    <button
                      onClick={() => openEditModal(p)}
                      className="flex-1 bg-blue-400 text-white py-1.5 rounded text-xs hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-wrap justify-center gap-1.5">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1.5 text-xs border bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            Prev
          </button>

          {/* Show limited page buttons on small screens */}
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            // On small screens, only show nearby pages to avoid overflow
            const isNearCurrent = Math.abs(page - currentPage) <= 2;
            const isFirstOrLast = page === 1 || page === totalPages;
            if (!isNearCurrent && !isFirstOrLast) return null;
            return (
              <button
                key={i}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 text-xs border rounded transition-colors ${
                  currentPage === page
                    ? "bg-gray-600 text-white border-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1.5 text-xs border bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}

      {/* MODALS */}
      {selectedProduct && (
        <StockAdjustmentModal
          isOpen={isAdjustOpen}
          onClose={() => setIsAdjustOpen(false)}
          product={selectedProduct}
          refresh={fetchProducts}
        />
      )}

      {productToEdit && (
        <EditProductModal
          key={productToEdit.id}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setProductToEdit(null);
          }}
          product={productToEdit}
          refresh={fetchProducts}
        />
      )}
    </div>
  );
};

export default AdminiProductList;