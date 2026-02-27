import { useEffect, useMemo, useState } from "react";
import { getAllSales } from "../../../utils/sales.util";

/**
 * PURE LOGIC FUNCTION (Moved outside for React Compiler optimization)
 * Aggregates individual sale items into a summary per product.
 */
const aggregateItemSales = (sales) => {
  const itemMap = {};

  sales.forEach((sale) => {
    if (!sale.items) return;

    const cashierName = sale.user?.full_name || "System";
    const saleTime = new Date(sale.created_at).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    sale.items.forEach((item) => {
      const id = item.product_id;

      if (!itemMap[id]) {
        itemMap[id] = {
          name: item.product_name || "Unknown",
          unitPrice: Number(item.unit_price || 0),
          quantity: 0,
          totalPrice: 0,
          lastSold: saleTime,
          lastCashier: cashierName
        };
      }

      const qty = Number(item.quantity || 0);
      itemMap[id].quantity += qty;
      itemMap[id].totalPrice += qty * Number(item.unit_price || 0);

      // Always update to show the most recent sale details
      itemMap[id].lastSold = saleTime;
      itemMap[id].lastCashier = cashierName;
    });
  });

  // Sort by quantity ascending (lowest sellers first)
  const sortedArray = Object.values(itemMap).sort((a, b) => a.quantity - b.quantity);

  return {
    itemSummary: sortedArray,
    grandTotalQuantity: sortedArray.reduce((sum, item) => sum + item.quantity, 0),
    grandTotalPrice: sortedArray.reduce((sum, item) => sum + item.totalPrice, 0),
  };
};

const ItemSales = () => {
  /* ===================== STATE ===================== */
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [dataState, setDataState] = useState({
    sales: [],
    loading: true,
  });

  /* ===================== FETCH ===================== */
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

  /* ===================== MEMOIZED DATA ===================== */
  const { itemSummary, grandTotalQuantity, grandTotalPrice } = useMemo(() => 
    aggregateItemSales(dataState.sales), 
    [dataState.sales]
  );

  return (
    <div className="p-2 sm:p-4 max-w-[1600px] mx-auto text-gray-700 text-xs sm:text-sm">
      
      {/* Compact Header & Picker */}
      <div className="mb-4 flex flex-wrap justify-between items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h3 className="text-lg font-bold text-gray-900 leading-tight">Itemized Sales</h3>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Daily performance report</p>
        </div>

        <div className="flex items-center gap-2">
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-2 py-1.5 border rounded-lg text-xs font-bold text-blue-600 outline-none focus:ring-2 focus:ring-blue-100"
          />
          <button 
            onClick={() => setSelectedDate(new Date().toISOString().slice(0, 10))}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-lg transition-all"
          >
            Today
          </button>
        </div>

        <div className="bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">
          <span className="text-[9px] font-black text-emerald-600 uppercase block leading-none">Revenue</span>
          <p className="text-lg font-black text-emerald-900 mt-0.5">
            {grandTotalPrice.toLocaleString()} <span className="text-[10px] font-normal">RWF</span>
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 text-gray-500 border-b text-[10px] font-bold uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Product Details</th>
                <th className="px-3 py-3 text-right">Price</th>
                <th className="px-3 py-3 text-center">Qty</th>
                <th className="px-3 py-3 text-right">Subtotal</th>
                <th className="px-4 py-3 text-left pl-8">Last Cashier</th>
                <th className="px-4 py-3 text-right">Time</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 text-[11px]">
              {dataState.loading ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="inline-block animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full" />
                  </td>
                </tr>
              ) : (
                itemSummary.map((item, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/20 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-bold text-gray-800">{item.name}</p>
                      <span className="text-[9px] text-gray-400 font-mono italic">#p_{idx + 10}</span>
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-gray-400">
                      {item.unitPrice.toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.quantity < 3 ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                      }`}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right font-bold text-gray-900">
                      {item.totalPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 pl-8">
                      <div className="flex items-center gap-2">
                          
                          <span className="text-[10px] text-gray-500 font-medium">{item.lastCashier}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-[10px] font-mono text-gray-400">{item.lastSold}</span>
                    </td>
                  </tr>
                ))
              )}

              {!dataState.loading && itemSummary.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-16 text-gray-400 italic">No items sold on this date.</td>
                </tr>
              )}
            </tbody>

            <tfoot className="bg-gray-900 text-white font-bold text-[11px]">
              <tr>
                <td className="px-4 py-4">Total Aggregates</td>
                <td className="px-3 py-4"></td>
                <td className="px-3 py-4 text-center text-emerald-400">{grandTotalQuantity} Items</td>
                <td className="px-3 py-4 text-right text-emerald-400">{grandTotalPrice.toLocaleString()} RWF</td>
                <td colSpan="2" className="px-4 py-4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ItemSales;