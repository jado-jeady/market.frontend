import { useEffect, useState } from "react";
import { getAllSales, getCashiers } from "../../../utils/sales.util";

const WeeklyCashierSales = () => {
  const [sales, setSales] = useState([]);
  const [cashiers, setCashiers] = useState([]);
  const [loading, setLoading] = useState(true);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const fetchData = async () => {
    setLoading(true);
    const [salesRes, cashierRes] = await Promise.all([
      getAllSales({ limit: 1000000, page: 1 }),
      getCashiers()
    ]);
    if (salesRes?.success) setSales(salesRes.data);
    if (cashierRes?.success) setCashiers(cashierRes.data);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await fetchData();
    })();
  }, []);

  /* ===================== WEEKLY GROUPING LOGIC ===================== */
  const getWeeklyData = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 is Sunday
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to Monday
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);

    return cashiers.map((cashier) => {
      const weeklyTotals = daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: 0 }), {});
      
      let cashierGrandTotal = 0;

      sales.forEach((sale) => {
        const saleDate = new Date(sale.created_at);
        if (sale.user_id === cashier.id && sale.status === "COMPLETED" && saleDate >= monday) {
          const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(saleDate);
          const amount = Number(sale.subtotal || 0);
          weeklyTotals[dayName] += amount;
          cashierGrandTotal += amount;
        }
      });

      return { name: cashier.full_name, totals: weeklyTotals, cashierGrandTotal };
    });
  };

  const reportData = getWeeklyData();

  if (loading) return <div className="p-6 text-center">Loading Weekly Report...</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto text-gray-700">
  <div className="mb-4">
    <h3 className="text-xl lg:text-3xl font-bold text-gray-900">Weekly Sales</h3>
  </div>

  {/* 1. Main scroll container */}
  <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
    <div className="overflow-x-auto"> {/* This enables the horizontal swipe on mobile */}
      <table className="w-full text-sm lg:text-base border-collapse min-w-[800px]"> {/* min-w ensures it doesn't squish too much */}
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            {/* 2. Sticky First Column */}
            <th className="sticky left-0 z-20 bg-gray-100 px-4 py-4 text-left font-bold border-b shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
              Cashier
            </th>
            {daysOfWeek.map((day) => (
              <th key={day} className="px-3 py-4 text-right border-b font-semibold whitespace-nowrap">
                {day.slice(0, 3)}
              </th>
            ))}
            {/* 3. Sticky Last Column (Optional but helpful) */}
            <th className="sticky right-0 z-20 bg-gray-200 px-4 py-4 text-right border-b font-bold shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]">
              Total
            </th>
          </tr>
        </thead>
        
        <tbody className="divide-y divide-gray-100">
          {reportData.map((row, idx) => (
            <tr key={idx} className="hover:bg-blue-50/50 transition-colors group">
              {/* Sticky Name Cell */}
              <td className="sticky left-0 z-10 bg-white group-hover:bg-blue-50 px-4 py-4 font-medium shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-gray-50">
                {row.name}
              </td>
              
              {daysOfWeek.map((day) => (
                <td key={day} className="px-3 py-4 text-right whitespace-nowrap">
                  {row.totals[day] > 0 ? row.totals[day].toLocaleString() : "-"}
                </td>
              ))}

              {/* Sticky Total Cell */}
              <td className="sticky right-0 z-10 bg-gray-50 group-hover:bg-blue-100 px-4 py-4 text-right font-bold text-green-700 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                {row.cashierGrandTotal.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  
  {/* Mobile Hint */}
  <p className="mt-2 text-[10px] text-gray-400 sm:hidden">← Swipe horizontally to see all days →</p>
</div>

  );
};

export default WeeklyCashierSales;
