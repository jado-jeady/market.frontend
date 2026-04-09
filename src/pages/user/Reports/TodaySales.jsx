import { useEffect, useState } from "react";
import { getSalesByShift } from "../../../utils/sales.util";
import { Loader2, Calendar, RefreshCcw } from "lucide-react";
import { getShiftBusinessDates } from "../../../utils/shift.util";

const CashierShiftSales = () => {
  const authData = JSON.parse(localStorage.getItem("user"));
  const cashierId = authData?.data?.user?.id;

  const [sales, setSales] = useState([]);
  const [businessDates, setBusinessDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [datesLoading, setDatesLoading] = useState(false);

  // 1. Fetch distinct business dates for this cashier
  const fetchBusinessDates = async () => {
    setDatesLoading(true); // Start spinner
    try {
      const res = await getShiftBusinessDates();
      console.log("Raw shift data:", res.data);

      if (res.success && Array.isArray(res.data)) {
        const dates = [
          ...new Set(
            res.data
              // Access the property directly on the object
              .map((shift) => shift.business_date)
              .filter(Boolean),
          ),
        ];

        // This ensures businessDates is an array of strings like ["2026-04-04"]
        setBusinessDates(dates.sort().reverse());
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setDatesLoading(false); // Stop spinner
    }
  };

  // 2. Fetch sales when a business date is selected
  const fetchSalesByDate = async (date) => {
    if (!date) return;
    setLoading(true);
    try {
      const res = await getSalesByShift({ cashierId, businessDate: date });
      if (res.success) {
        // Now you have access to summary, items, and sales
        setSales(res.sales);
        setSummary(res.summary); // Add a new state for this
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cashierId) fetchBusinessDates();
  }, [cashierId]);

  // Trigger sales fetch whenever the date changes
  useEffect(() => {
    if (selectedDate) fetchSalesByDate(selectedDate);
  }, [selectedDate]);

  const totalAmount = sales.reduce(
    (sum, s) => sum + Number(s.subtotal || 0),
    0,
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-600">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Shift Performance</h3>
          <p className="text-xs text-gray-500">
            View sales summary by business date
          </p>
        </div>
        <button
          onClick={fetchBusinessDates}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <RefreshCcw
            className={`w-4 h-4 ${datesLoading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center gap-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Calendar className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
            Business Date
          </label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            disabled={datesLoading}
            className="w-full md:w-64 border rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">
              {datesLoading ? "Loading dates..." : "-- Choose a Date --"}
            </option>
            {businessDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
          <p className="text-sm text-gray-400 font-medium">
            Analyzing shift data...
          </p>
        </div>
      ) : selectedDate ? (
        sales.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Invoice</th>
                  <th className="px-6 py-4 text-center">Time</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {sale.invoice_number}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-500">
                      {new Date(sale.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      {Number(sale.subtotal).toLocaleString()} RWF
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase">
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2 border-gray-100 font-black">
                <tr>
                  <td
                    colSpan="2"
                    className="px-6 py-4 text-right text-gray-400 uppercase text-xs"
                  >
                    Total for {selectedDate}
                  </td>
                  <td className="px-6 py-4 text-right text-green-700 text-lg">
                    {totalAmount.toLocaleString()} RWF
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm">
              No sales data found for this business date.
            </p>
          </div>
        )
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-400 text-sm italic">
            Select a date above to see your sales breakdown.
          </p>
        </div>
      )}
    </div>
  );
};

export default CashierShiftSales;
