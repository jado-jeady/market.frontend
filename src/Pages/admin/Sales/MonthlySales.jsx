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
    <div className="p-6 overflow-x-auto text-gray-700">
      <h3 className="text-xl font-bold mb-4">Weekly Sales by Cashier</h3>
      <table className="w-full text-sm border-collapse bg-white shadow-sm rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="px-4 py-3 text-left border-b">Cashier</th>
            {daysOfWeek.map(day => (
              <th key={day} className="px-2 py-3 text-right border-b">{day.slice(0, 3)}</th>
            ))}
            <th className="px-4 py-3 text-right border-b bg-gray-200">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {reportData.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium border-b">{row.name}</td>
              {daysOfWeek.map(day => (
                <td key={day} className="px-2 py-3 text-right border-b">
                  {row.totals[day] > 0 ? row.totals[day].toLocaleString() : "-"}
                </td>
              ))}
              <td className="px-4 py-3 text-right font-bold border-b bg-gray-50 text-green-700">
                {row.cashierGrandTotal.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyCashierSales;
