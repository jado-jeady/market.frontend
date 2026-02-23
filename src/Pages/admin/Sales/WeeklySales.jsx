import { useEffect, useState, useMemo } from "react";
import { getAllSales, getCashiers } from "../../../utils/sales.util";

// Pure logic kept outside for React Compiler optimization
const formatWeeklyReport = (sales, cashiers, selectedDate, daysOfWeek) => {
  const picked = new Date(selectedDate);
  const day = picked.getDay();
  const diff = picked.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(picked.setDate(diff));
  monday.setHours(0, 0, 0, 0);

  return cashiers.map((cashier) => {
    const weeklyTotals = daysOfWeek.reduce((acc, d) => ({ ...acc, [d]: 0 }), {});
    let cashierGrandTotal = 0;

    sales.forEach((sale) => {
      const saleDate = new Date(sale.created_at);
      // Check if sale belongs to this cashier and happened on or after the selected Monday
      if (sale.user_id === cashier.id && sale.status === "COMPLETED" && saleDate >= monday) {
        const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(saleDate);
        const amount = Number(sale.subtotal || 0);
        if (weeklyTotals[dayName] !== undefined) {
          weeklyTotals[dayName] += amount;
          cashierGrandTotal += amount;
        }
      }
    });
    return { name: cashier.full_name, totals: weeklyTotals, cashierGrandTotal };
  });
};

const WeeklySales = () => {
  const [sales, setSales] = useState([]);
  const [cashiers, setCashiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  const daysOfWeek = useMemo(() => ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [salesRes, cashierRes] = await Promise.all([
        getAllSales({ limit: 1000000, page: 1 }),
        getCashiers()
      ]);
      if (salesRes?.success) setSales(salesRes.data);
      if (cashierRes?.success) setCashiers(cashierRes.data);
    } catch (error) {
      console.error("Fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const reportData = useMemo(() => 
    formatWeeklyReport(sales, cashiers, selectedDate, daysOfWeek),
    [sales, cashiers, selectedDate, daysOfWeek]
  );

  return (
    <div className="p-2 sm:p-4 max-w-5xl mx-auto text-gray-700 text-xs sm:text-sm">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-3 bg-white p-3 rounded-lg border shadow-sm gap-2">
        <h3 className="font-bold truncate">Weekly Performance</h3>
        
        <div className="flex items-center gap-2">
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-2 py-1 border rounded text-[11px] font-semibold text-blue-600 outline-none"
          />
          <button 
            onClick={() => setSelectedDate(new Date().toISOString().slice(0, 10))}
            className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all shadow-sm"
            title="Reset to Current Week"
          >
            <svg xmlns="http://www.w3.org" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Condensed Table */}
      <div className="bg-white rounded-lg border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 border-b text-[10px] uppercase font-bold tracking-wider">
                <th className="sticky left-0 z-10 bg-gray-50 px-3 py-2 text-left border-r">Cashier</th>
                {daysOfWeek.map(day => (
                  <th key={day} className="px-1 py-2 text-right">{day.slice(0, 1)}</th>
                ))}
                <th className="px-3 py-2 text-right bg-blue-50/50 text-blue-600 border-l">Total</th>
              </tr>
            </thead>
            
            <tbody className="divide-y text-[11px]">
              {loading ? (
                <tr><td colSpan="9" className="py-10 text-center animate-pulse text-gray-400">Loading data...</td></tr>
              ) : (
                reportData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/20 transition-colors group">
                    <td className="sticky left-0 z-10 bg-white group-hover:bg-blue-50/20 px-3 py-2 font-semibold border-r truncate max-w-[90px]">
                      {row.name}
                    </td>
                    {daysOfWeek.map(day => (
                      <td key={day} className="px-1 py-2 text-right text-gray-500 font-mono">
                        {row.totals[day] > 0 ? row.totals[day].toLocaleString() : "-"}
                      </td>
                    ))}
                    <td className="px-3 py-2 text-right font-bold bg-blue-50/30 text-blue-700 border-l">
                      {row.cashierGrandTotal.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WeeklySales;
