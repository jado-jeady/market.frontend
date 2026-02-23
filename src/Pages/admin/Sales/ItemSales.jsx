import { useEffect, useMemo, useState } from "react";
import { getAllSales } from "../../../utils/sales.util";

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
      const salesResponse = await getAllSales({
        limit: 1000000,
        page: 1,
        start_date: selectedDate, // Filter by picker
        
        status: "COMPLETED",
      });

      setDataState({
        sales: salesResponse?.success ? salesResponse.data : [],
        loading: false,
      });
    } catch (error) {
      console.error("Fetch error:", error);
      setDataState((prev) => ({ ...prev, loading: false }));
    }
  };

  // Re-run fetch whenever the selectedDate changes
  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  /* ===================== AGGREGATE & SORT ===================== */
  const { itemSummary, grandTotalQuantity, grandTotalPrice } = useMemo(() => {
    const itemMap = {};

    dataState.sales.forEach((sale) => {
      if (!sale.items) return;
      
      const cashierName = sale.user?.full_name || "System";
      // Extract time from the created_at timestamp
      const saleTime = new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
        
        itemMap[id].quantity += Number(item.quantity || 0);
        itemMap[id].totalPrice += Number(item.quantity || 0) * Number(item.unit_price || 0);
        
        // Updates to the latest sale info for that specific product
        itemMap[id].lastSold = saleTime;
        itemMap[id].lastCashier = cashierName;
      });
    });

    const sortedArray = Object.values(itemMap).sort((a, b) => a.quantity - b.quantity);

    return {
      itemSummary: sortedArray,
      grandTotalQuantity: sortedArray.reduce((sum, item) => sum + item.quantity, 0),
      grandTotalPrice: sortedArray.reduce((sum, item) => sum + item.totalPrice, 0),
    };
  }, [dataState.sales]);

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-[1600px] 2xl:max-w-[2400px] mx-auto text-gray-700">
      
      {/* Header & Date Picker Section */}
      <div className="mb-8 flex flex-wrap justify-between items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="min-w-[200px]">
          <h3 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">Itemized Sales</h3>
          <p className="text-sm text-gray-500">Analyze performance by product</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Select Date</label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm lg:text-base font-medium text-gray-700 shadow-inner"
            />
          </div>
          
          <button 
            onClick={() => setSelectedDate(new Date().toISOString().slice(0, 10))}
            className="mt-5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold rounded-xl transition-all active:scale-95"
          >
            Today
          </button>
        </div>

        <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 min-w-[180px]">
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Revenue</span>
          <p className="text-2xl lg:text-3xl font-black text-emerald-900 mt-1">
            {grandTotalPrice.toLocaleString()} <span className="text-sm font-medium">RWF</span>
          </p>
        </div>
      </div>

      {/* Loading State */}
      {dataState.loading ? (
        <div className="py-32 flex flex-col justify-center items-center h-full">
          <div className="animate-spin h-12 w-12 border-4 border-blue-100 border-t-blue-600 rounded-full mb-4" />
          <p className="text-gray-400 font-medium animate-pulse">Fetching sales records...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-500">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm lg:text-base border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 border-b uppercase text-[11px] font-bold tracking-widest">
                  <th className="px-6 py-5 text-left">Product Details</th>
                  <th className="px-4 py-5 text-right">Unit Price</th>
                  <th className="px-4 py-5 text-center">Qty Sold</th>
                  <th className="px-4 py-5 text-right">Subtotal</th>
                  <th className="px-4 py-5 text-left pl-12">Last Cashier</th>
                  <th className="px-6 py-5 text-right">Last Time</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {itemSummary.map((item, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-800 lg:text-lg group-hover:text-blue-700 transition-colors">{item.name}</p>
                      <span className="text-[10px] text-gray-300 font-mono">ITEM_{idx + 100}</span>
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-gray-400 italic">
                      {item.unitPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-block w-10 py-1 rounded-lg text-xs font-black ${
                        item.quantity < 3 ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-blue-50 text-blue-700 border border-blue-100"
                      }`}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right font-black text-gray-900">
                      {item.totalPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 pl-12">
                      <div className="flex items-center gap-3">
                          <div className="w-7 h-7 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-[10px] font-black border border-indigo-200 uppercase">
                              {item.lastCashier.charAt(0)}
                          </div>
                          <span className="text-xs font-semibold text-gray-500">{item.lastCashier}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[11px] bg-gray-100 px-3 py-1.5 rounded-full font-bold text-gray-500 shadow-sm">
                          {item.lastSold}
                      </span>
                    </td>
                  </tr>
                ))}

                {itemSummary.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-24">
                      <p className="text-3xl mb-2 opacity-30">📂</p>
                      <p className="text-gray-400 font-medium italic">No sales found for {selectedDate}</p>
                    </td>
                  </tr>
                )}
              </tbody>

              <tfoot className="bg-gray-900 text-white font-bold">
                <tr>
                  <td className="px-6 py-6 lg:text-xl">Totals for {selectedDate}</td>
                  <td className="px-4 py-6"></td>
                  <td className="px-4 py-6 text-center text-emerald-400">{grandTotalQuantity} Items</td>
                  <td className="px-4 py-6 text-right text-emerald-400 lg:text-xl">{grandTotalPrice.toLocaleString()} RWF</td>
                  <td colSpan="2" className="px-6 py-6 text-right text-gray-400 text-[10px] font-normal tracking-tighter uppercase italic">
                    Finalized Aggregation
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemSales;
