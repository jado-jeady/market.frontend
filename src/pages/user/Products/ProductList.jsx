import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getAllCategories } from "../../../utils/category.util";
import { getAllProducts } from "../../../utils/product.util";
import {
  TriangleAlert,
  Loader2,
  Package,
  Search,
  RotateCcw,
  X,
  ScanBarcode,
  MessageSquareText,
  Eye,
  Info,
  Calendar,
  DollarSign,
  Tag,
} from "lucide-react";

const ITEMS_PER_PAGE = 18;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [note, setNote] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [stockLevel, setStockLevel] = useState("all");

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getAllCategories();
      setCategories(Array.isArray(res?.data) ? res.data : []);
    };
    fetchCategories();
    fetchProducts();
  }, []);

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

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleOpenNote = (product) => {
    setSelectedProduct(product);
    setIsNoteModalOpen(true);
  };

  const handleOpenView = (product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  return (
    <div className="p-2 text-gray-800 md:p-6 max-w-[2000px] mx-auto min-h-screen bg-gray-50/50">
      {/* HEADER & FILTERS (Stay visible) */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
            Stock Explorer
          </h2>
          <p className="text-xs text-gray-500 font-bold uppercase opacity-60">
            Inventory Live Status
          </p>
        </div>
        <button
          onClick={fetchProducts}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <RotateCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl p-1 mb-3 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, sku, or barcode..."
            className="w-full pl-10 pr-3 py-2 text-xs border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 text-xs border rounded-xl outline-none bg-gray-50"
        >
          <option value="all">Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          value={stockLevel}
          onChange={(e) => setStockLevel(e.target.value)}
          className="w-full px-3 py-2 text-xs border rounded-xl outline-none bg-gray-50"
        >
          <option value="all">Stock Level</option>
          <option value="in">Healthy Stock</option>
          <option value="low">Low Stock Alerts</option>
          <option value="out">Out of Stock</option>
        </select>
        <button
          onClick={() => {
            setSearch("");
            setCategory("all");
            setStockLevel("all");
          }}
          className="w-full py-2 text-xs font-black text-gray-400 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all uppercase tracking-widest"
        >
          Clear
        </button>
      </div>
      {/* ITEMS AREA */}

      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-400 text-xs font-black tracking-widest uppercase">
              Fetching Data...
            </p>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <p className="text-gray-400 text-xs font-black tracking-widest uppercase">
              No products found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {paginatedProducts.map((p) => {
              const isLow =
                p.stock_quantity <= p.min_stock && p.stock_quantity > 0;
              const isOut = p.stock_quantity === 0;

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col p-4 group hover:border-blue-200 transition-all h-full"
                >
                  <div className="flex justify-between items-start mb-3">
                    <button
                      onClick={() => handleOpenView(p)}
                      className="p-2 bg-gray-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${isOut ? "bg-red-50 text-red-600" : isLow ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"}`}
                    >
                      {isOut ? "Out" : isLow ? "Low" : "OK"}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h4 className="font-bold text-xs text-gray-800 truncate mb-1">
                      {p.name}
                    </h4>
                    <p className="text-[9px] text-gray-400 font-mono tracking-tighter mb-4">
                      {p.barcode || "NO BARCODE"}
                    </p>
                    <div className="bg-gray-50 p-2.5 rounded-xl space-y-1.5">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-400 font-bold uppercase">
                          Price
                        </span>
                        <span className="font-black text-gray-900">
                          {Number(p.selling_price).toLocaleString()} F
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-400 font-bold uppercase">
                          Stock
                        </span>
                        <span
                          className={`font-black ${isLow || isOut ? "text-red-500" : "text-gray-900"}`}
                        >
                          {p.stock_quantity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ACTION AREA (Fixed Height) */}
                  <div className="mt-5 h-9 flex items-center">
                    {isLow || isOut ? (
                      <button
                        onClick={() => handleOpenNote(p)}
                        className="w-full h-full inline-flex items-center justify-center bg-red-600 text-white text-[10px] font-black uppercase rounded-xl animate-pulse"
                      >
                        <TriangleAlert className="w-3 h-3 mr-2" /> Alert
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenView(p)}
                        className="w-full h-full border border-gray-100 text-gray-400 hover:bg-gray-50 text-[10px] font-bold uppercase rounded-xl transition-all"
                      >
                        Details
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* VIEW DETAILS MODAL */}
      {isViewModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-md w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-red-400 p-3 text-white flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black uppercase leading-tight pr-4">
                  {selectedProduct.name}
                </h3>
                <p className="text-[10px] text-white font-mono mt-1 tracking-widest">
                  SKU: {selectedProduct.sku}
                </p>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full"
              >
                <X />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                  <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">
                    Selling Price
                  </p>
                  <p className="text-lg font-black text-blue-900">
                    {Number(selectedProduct.selling_price).toLocaleString()} F
                  </p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase mb-1">
                    Stock Level
                  </p>
                  <p className="text-lg font-black text-emerald-900">
                    {selectedProduct.stock_quantity} units
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <DetailRow
                  label="Category"
                  val={selectedProduct.category?.name}
                  icon={<Tag className="w-3.5 h-3.5" />}
                />
                <DetailRow
                  label="Supplier"
                  val={selectedProduct.supplier}
                  icon={<Package className="w-3.5 h-3.5" />}
                />
                <DetailRow
                  label="Buying Price"
                  val={`${Number(selectedProduct.buying_price).toLocaleString()} F`}
                  icon={<DollarSign className="w-3.5 h-3.5" />}
                />

                <DetailRow
                  label="Expiry Date"
                  val={
                    selectedProduct.expire_date
                      ? new Date(
                          selectedProduct.expire_date,
                        ).toLocaleDateString()
                      : "N/A"
                  }
                  icon={<Calendar className="w-3.5 h-3.5" />}
                />

                <DetailRow
                  label="Min Stock Alert"
                  val={selectedProduct.min_stock}
                  icon={<Info className="w-3.5 h-3.5" />}
                />
                <DetailRow
                  label="Created At"
                  val={selectedProduct?.created_at || "Not Available"}
                  icon={<Info className="w-3.5 h-3.5" />}
                />
                <DetailRow
                  label="Barcode"
                  val={selectedProduct.barcode}
                  icon={<ScanBarcode className="w-3.5 h-3.5" />}
                />
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t">
              <h4 className="text-sm font-bold text-gray-900 mb-2">
                Product Description
              </h4>
              <p className="text-xs text-gray-600 italic">
                "{selectedProduct.description || `Not Available`}"
              </p>
            </div>
          </div>
        </div>
      )}
      {/* ALERT NOTE MODAL */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg   font-black text-gray-900 uppercase mb-2">
                Alert Reason
              </h3>
              <p className="text-xs text-gray-500 mb-6 font-medium">
                Adding note for{" "}
                <span className="font-black text-gray-900">
                  {selectedProduct?.name}
                </span>
              </p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Type the reason here..."
                className="w-full h-32 p-4 text-gray-900 text-sm border rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
              />
            </div>
            <div className="p-4 bg-gray-50 border-t flex gap-3">
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="flex-1 py-4 text-xs font-black text-gray-400 uppercase"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="flex-1 py-4 bg-red-600 text-white text-xs font-black uppercase rounded-2xl shadow-lg"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailRow = ({ label, val, icon }) => (
  <div className="flex justify-between items-center text-xs py-2 border-b border-gray-50">
    <div className="flex items-center gap-2 text-gray-400 font-bold uppercase tracking-tighter">
      {icon} <span>{label}</span>
    </div>
    <span className="font-black text-gray-800">{val || "N/A"}</span>
  </div>
);

export default ProductList;
