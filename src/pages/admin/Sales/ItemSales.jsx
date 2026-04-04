import { useEffect, useMemo, useState } from "react";
import { getAllSales } from "../../../utils/sales.util";

const aggregateItemSales = (sales) => {
  const itemMap = {};

  sales.forEach((sale) => {
    if (!sale.items) return;

    const cashierName = sale.user?.full_name || "System";
    const saleTime = new Date(sale.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    sale.items.forEach((item) => {
      const id = item.product_id;

      if (!itemMap[id]) {
        itemMap[id] = {
          name: item.product_name || "Unknown",
          barcode: item.product?.barcode || item.barcode || "",
          category: item.product?.category || item.category || "Uncategorized",
          unitPrice: Number(item.unit_price || 0),
          quantity: 0,
          totalPrice: 0,
          lastSold: saleTime,
          lastCashier: cashierName,
        };
      }

      const qty = Number(item.quantity || 0);
      itemMap[id].quantity += qty;
      itemMap[id].totalPrice += qty * Number(item.unit_price || 0);
      itemMap[id].lastSold = saleTime;
      itemMap[id].lastCashier = cashierName;
    });
  });

  const sortedArray = Object.values(itemMap).sort(
    (a, b) => b.quantity - a.quantity,
  );

  return {
    itemSummary: sortedArray,
    grandTotalQuantity: sortedArray.reduce((sum, i) => sum + i.quantity, 0),
    grandTotalPrice: sortedArray.reduce((sum, i) => sum + i.totalPrice, 0),
  };
};

const ItemSales = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [dataState, setDataState] = useState({ sales: [], loading: true });
  const [barcodeSearch, setBarcodeSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchData = async () => {
    setDataState((prev) => ({ ...prev, loading: true }));
    try {
      const res = await getAllSales({
        limit: 1000000,
        page: 1,
        start_date: selectedDate,
        status: "COMPLETED",
      });
      setDataState({
        sales: res?.success ? res.data : [],
        loading: false,
      });
    } catch (error) {
      console.error("Fetch error:", error);
      setDataState((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const { itemSummary, grandTotalQuantity, grandTotalPrice } = useMemo(
    () => aggregateItemSales(dataState.sales),
    [dataState.sales],
  );

  const categories = useMemo(() => {
    const cats = [...new Set(itemSummary.map((i) => i.category))].filter(
      Boolean,
    );
    return ["All", ...cats];
  }, [itemSummary]);

  const filteredItems = useMemo(() => {
    let result = [...itemSummary];

    if (barcodeSearch.trim()) {
      result = result.filter((item) =>
        item.barcode.toLowerCase().includes(barcodeSearch.trim().toLowerCase()),
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    result.sort((a, b) =>
      sortOrder === "desc" ? b.quantity - a.quantity : a.quantity - b.quantity,
    );

    return result;
  }, [itemSummary, barcodeSearch, selectedCategory, sortOrder]);

  const filteredTotalQty = filteredItems.reduce((s, i) => s + i.quantity, 0);
  const filteredTotalPrice = filteredItems.reduce(
    (s, i) => s + i.totalPrice,
    0,
  );

  return (
    <div className="p-2 sm:p-4 max-w-[1600px] mx-auto text-gray-700 text-xs sm:text-sm">
      {/* ── Header ── */}
      <div className="mb-4 flex flex-wrap justify-between items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h3 className="text-lg font-bold text-gray-900 leading-tight">
            Itemized Sales
          </h3>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
            Daily performance report
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-2 py-1.5 border rounded-lg text-xs font-bold text-blue-600 outline-none focus:ring-2 focus:ring-blue-100"
          />
          <button
            onClick={() =>
              setSelectedDate(new Date().toISOString().slice(0, 10))
            }
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-lg transition-all"
          >
            Today
          </button>
        </div>

        <div className="bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">
          <span className="text-[9px] font-black text-emerald-600 uppercase block leading-none">
            Revenue
          </span>
          <p className="text-lg font-black text-emerald-900 mt-0.5">
            {grandTotalPrice.toLocaleString()}{" "}
            <span className="text-[10px] font-normal">RWF</span>
          </p>
        </div>
      </div>

      {/* ── Filters Bar ── */}
      <div className="mb-3 flex flex-wrap gap-2 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
        <input
          type="text"
          placeholder="Search by barcode..."
          value={barcodeSearch}
          onChange={(e) => setBarcodeSearch(e.target.value)}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-100 w-48"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          onClick={() =>
            setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
          }
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-all"
        >
          {sortOrder === "desc" ? <>↓ Highest Orders</> : <>↑ Lowest Orders</>}
        </button>

        {(barcodeSearch || selectedCategory !== "All") && (
          <button
            onClick={() => {
              setBarcodeSearch("");
              setSelectedCategory("All");
            }}
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold rounded-lg transition-all"
          >
            ✕ Clear
          </button>
        )}

        <span className="ml-auto text-[10px] text-gray-400 self-center">
          Showing {filteredItems.length} of {itemSummary.length} items
        </span>
      </div>

      {/* ── Loading Spinner ── */}
      {dataState.loading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full" />
        </div>
      )}

      {/* ── Empty State ── */}
      {!dataState.loading && filteredItems.length === 0 && (
        <div className="text-center py-16 text-gray-400 italic bg-white rounded-xl border border-gray-100">
          No items match the current filters.
        </div>
      )}

      {!dataState.loading && filteredItems.length > 0 && (
        <>
          {/* ══════════════════════════════════════
              MOBILE — Card Grid (visible < md)
          ══════════════════════════════════════ */}
          <div className="grid grid-cols-2 gap-2 md:hidden">
            {filteredItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex flex-col gap-2"
              >
                {/* Name + Category */}
                <div className="flex items-start justify-between gap-1">
                  <p className="font-bold text-gray-800 text-[11px] leading-tight line-clamp-2">
                    {item.name}
                  </p>
                  <span className="shrink-0 bg-purple-50 text-purple-600 text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.category}
                  </span>
                </div>

                {/* Barcode */}
                {item.barcode && (
                  <p className="font-mono text-[9px] text-gray-400 truncate">
                    {item.barcode}
                  </p>
                )}

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-1 mt-auto">
                  <div className="bg-blue-50 rounded-lg px-2 py-1.5 text-center">
                    <p className="text-[8px] text-blue-400 font-bold uppercase">
                      Qty Sold
                    </p>
                    <p
                      className={`text-sm font-black ${item.quantity < 3 ? "text-red-500" : "text-blue-600"}`}
                    >
                      {item.quantity}
                    </p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg px-2 py-1.5 text-center">
                    <p className="text-[8px] text-emerald-400 font-bold uppercase">
                      Revenue
                    </p>
                    <p className="text-[11px] font-black text-emerald-700">
                      {item.totalPrice.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Unit price + cashier */}
                <div className="flex justify-between items-center pt-1 border-t border-gray-50">
                  <span className="text-[9px] text-gray-400">
                    {item.unitPrice.toLocaleString()} RWF/unit
                  </span>
                  <span className="text-[9px] text-gray-500 font-medium truncate max-w-[80px] text-right">
                    {item.lastCashier}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Footer Totals */}
          <div className="md:hidden mt-3 bg-gray-900 text-white rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-[9px] text-gray-400 uppercase font-bold">
                Total Items
              </p>
              <p className="text-lg font-black text-emerald-400">
                {filteredTotalQty}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-gray-400 uppercase font-bold">
                Total Revenue
              </p>
              <p className="text-lg font-black text-emerald-400">
                {filteredTotalPrice.toLocaleString()}{" "}
                <span className="text-[10px] font-normal">RWF</span>
              </p>
            </div>
          </div>

          {/* ══════════════════════════════════════
              DESKTOP — Table (visible >= md)
          ══════════════════════════════════════ */}
          <div className="hidden md:block bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 border-b text-[10px] font-bold uppercase tracking-wider">
                    <th className="px-4 py-3 text-left">Product Details</th>
                    <th className="px-3 py-3 text-left">Barcode</th>
                    <th className="px-3 py-3 text-left">Category</th>
                    <th className="px-3 py-3 text-right">Price</th>
                    <th className="px-3 py-3 text-center">Qty</th>
                    <th className="px-3 py-3 text-right">Subtotal</th>
                    <th className="px-4 py-3 text-left pl-8">Last Cashier</th>
                    <th className="px-4 py-3 text-right">Time</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50 text-[11px]">
                  {filteredItems.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-blue-50/20 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="font-bold text-gray-800">{item.name}</p>
                      </td>
                      <td className="px-3 py-3 font-mono text-gray-400 text-[10px]">
                        {item.barcode || "—"}
                      </td>
                      <td className="px-3 py-3">
                        <span className="bg-purple-50 text-purple-600 text-[9px] font-bold px-2 py-0.5 rounded-full">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-gray-400">
                        {item.unitPrice.toLocaleString()}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.quantity < 3
                              ? "bg-red-50 text-red-600"
                              : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right font-bold text-gray-900">
                        {item.totalPrice.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 pl-8">
                        <span className="text-[10px] text-gray-500 font-medium">
                          {item.lastCashier}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-[10px] font-mono text-gray-400">
                          {item.lastSold}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot className="bg-gray-900 text-white font-bold text-[11px]">
                  <tr>
                    <td className="px-4 py-4" colSpan="4">
                      {filteredItems.length < itemSummary.length
                        ? "Filtered Totals"
                        : "Total Aggregates"}
                    </td>
                    <td className="px-3 py-4 text-center text-emerald-400">
                      {filteredTotalQty} Items
                    </td>
                    <td className="px-3 py-4 text-right text-emerald-400">
                      {filteredTotalPrice.toLocaleString()} RWF
                    </td>
                    <td colSpan="2" className="px-4 py-4"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ItemSales;
