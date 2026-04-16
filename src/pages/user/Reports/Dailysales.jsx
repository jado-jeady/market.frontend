import { useEffect, useState } from "react";
import { getCashierSalesByShiftDate } from "../../../utils/sales.util";
import {
  Loader2,
  Calendar,
  RefreshCcw,
  TrendingUp,
  Hash,
  Receipt,
  ShoppingBag,
  Clock,
  CreditCard,
  ChevronRight,
  Package,
  CalendarRangeIcon,
  User2,
} from "lucide-react";
import { getShiftBusinessDates } from "../../../utils/shift.util";

const CashierShiftSales = () => {
  const authData = JSON.parse(localStorage.getItem("user"));
  const cashierId = authData?.data?.user?.id;

  const [sales, setSales] = useState([]);
  const [businessDates, setBusinessDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [datesLoading, setDatesLoading] = useState(false);

  const fetchBusinessDates = async () => {
    setDatesLoading(true);
    try {
      const res = await getShiftBusinessDates();
      if (res.success && Array.isArray(res.data)) {
        const dates = [
          ...new Set(
            res.data.map((shift) => shift.business_date).filter(Boolean),
          ),
        ];
        setBusinessDates(dates.sort().reverse());
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setDatesLoading(false);
    }
  };

  const fetchSalesByDate = async (date) => {
    if (!date) return;
    setLoading(true);
    try {
      const res = await getCashierSalesByShiftDate(date);
      if (res.success) {
        setSales(res.data || []);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cashierId) fetchBusinessDates();
  }, [cashierId]);

  useEffect(() => {
    if (selectedDate) fetchSalesByDate(selectedDate);
  }, [selectedDate]);

  const grandTotalSales = sales.reduce(
    (sum, s) => sum + Number(s.total_amount || 0),
    0,
  );
  const totalTransactions = sales.length;

  return (
    <div className="p-4 md:p-1 lg:p-4 bg-gray-50/50 min-h-screen text-gray-600">
      {/* HEADER SECTION */}
      <div className="mb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-lg font-black text-gray-900 uppercase tracking-tight ">
            Shift Performance
          </p>
          <p className="text-xs text-gray-500 font-bold tracking-widest opacity-60">
            Transaction insights for {selectedDate || "Select a Date"}
          </p>
        </div>
      </div>

      {/* DATE SELECTOR BOX */}
      <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-100 mb-2 flex flex-col md:flex-row items-center gap-2">
        <div className="p-1 bg-blue-600 rounded-2 md:rounded-sm shadow-lg shadow-blue-100 flex-shrink-0">
          <CalendarRangeIcon className="w-7  h-7 text-white" />
        </div>
        <div className="w-full">
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            disabled={datesLoading}
            className="w-full md:w-60 border-2 border-gray-300 rounded-xl px-5 py-2 text-sm bg-gray-50 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold text-gray-800"
          >
            <option value="">
              {datesLoading ? "Syncing..." : "-- Select Effective Date --"}
            </option>
            {businessDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={fetchBusinessDates}
          className="flex items-center justify-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm active:scale-95 w-full md:w-auto"
        >
          <RefreshCcw
            className={`w-3.5 h-3.5 ${datesLoading ? "animate-spin" : ""}`}
          />
          {datesLoading ? "Syncing..." : "Sync"}
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">
            Building shift report...
          </p>
        </div>
      ) : selectedDate ? (
        sales.length > 0 ? (
          <div className="space-y-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KPI STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {/* Shift Revenue */}
              <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="absolute bg-emerald-50 rounded-sm opacity-40 group-hover:scale-105 transition-transform" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="p-1.5 bg-emerald-500 rounded-md text-white shadow-md shadow-emerald-100">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">
                      Shift Revenue
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {grandTotalSales.toLocaleString()}{" "}
                      <span className="text-xs font-medium text-emerald-600">
                        RWF
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Sales Volume */}
              <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="absolute -right-3 -top-3 w-16 h-16 bg-blue-50 rounded-full opacity-40 group-hover:scale-105 transition-transform" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="p-2.5 bg-blue-500 rounded-lg text-white shadow-md shadow-blue-100">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">
                      Sales Volume
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {totalTransactions}{" "}
                      <span className="text-xs font-medium text-blue-600">
                        Invoices
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* User Info (Cashier) */}
              <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="absolute -right-3 -top-3 w-16 h-16 bg-blue-50 rounded-full opacity-40 group-hover:scale-105 transition-transform" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="p-2.5 bg-blue-500 rounded-lg text-white shadow-md shadow-blue-100">
                    <User2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">
                      Sales Volume
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {totalTransactions}{" "}
                      <span className="text-xs font-medium text-blue-600">
                        Invoices
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* MOBILE: CARD LIST VIEW */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {sales.map((sale) => (
                <div
                  key={sale.id}
                  className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm active:scale-95 transition-transform"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-gray-900 rounded-lg">
                        <Receipt className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="font-black text-sm text-gray-900">
                        {sale.invoice_number}
                      </span>
                    </div>
                    <span className="bg-blue-50 text-blue-600 text-[9px] font-black uppercase px-2 py-1 rounded-lg">
                      {sale.payment_method}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {sale.items?.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-50 text-gray-500 text-[9px] font-bold px-2 py-1 rounded-md border border-gray-100"
                      >
                        {item.product_name} (x{item.quantity})
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase">
                        {new Date(sale.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-base font-black text-gray-900">
                      {Number(sale.total_amount).toLocaleString()} F
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP: DETAILED TABLE VIEW */}
            <div className="hidden md:block bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50/50 border-b">
                  <tr className="text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
                    <th className="px-8 py-5">Invoice Reference</th>
                    <th className="px-8 py-5">Time</th>
                    <th className="px-8 py-5">Cart Contents</th>
                    <th className="px-8 py-5 text-center">Method</th>
                    <th className="px-8 py-5 text-right">Settled Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sales.map((sale) => (
                    <tr
                      key={sale.id}
                      className="hover:bg-blue-50/20 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                            <Receipt className="w-4 h-4 text-gray-400" />
                          </div>
                          <span className="font-black text-gray-900">
                            {sale.invoice_number}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase">
                          <Clock className="w-3.5 h-3.5 opacity-40" />
                          {new Date(sale.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-wrap gap-1.5 max-w-md">
                          {sale.items?.map((item, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-50 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-lg border border-gray-100 flex items-center gap-1"
                            >
                              <Package className="w-3 h-3 opacity-40" />{" "}
                              {item.product_name}{" "}
                              <span className="text-blue-600 font-black">
                                ×{item.quantity}
                              </span>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                          <CreditCard className="w-3 h-3" />{" "}
                          {sale.payment_method}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className="font-black text-gray-900 text-base">
                          {Number(sale.total_amount).toLocaleString()}
                        </span>
                        <span className="text-[10px] font-black text-gray-400 ml-1.5">
                          RWF
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[2rem] border-2 border-dashed border-gray-100 animate-in fade-in duration-700">
            <ShoppingBag className="w-16 h-16 text-gray-100 mx-auto mb-4" />
            <p className="text-gray-400 text-sm font-black uppercase tracking-widest">
              No activity recorded for this shift
            </p>
          </div>
        )
      ) : (
        <div className="text-center py-32 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
          <Calendar className="w-16 h-16 text-gray-100 mx-auto mb-4" />
          <p className="text-gray-400 text-sm font-black uppercase tracking-widest">
            Select a business date to begin
          </p>
        </div>
      )}
    </div>
  );
};

export default CashierShiftSales;
