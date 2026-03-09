import { useEffect, useState } from "react";
import { getAllSales, getCashiers } from "../../../utils/sales.util";

const DailySales = () => {
  const [sales, setSales] = useState([]);
  const [cashiers, setCashiers] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const salesResponse = await getAllSales({
        start_date: today,
        end_date: today,
        status: "COMPLETED",
      });
      const cashierResponse = await getCashiers();

      if (salesResponse?.success) setSales(salesResponse.data);
      if (cashierResponse?.success) setCashiers(cashierResponse.data);

      setLoading(false);
    })();
  }, []);

  /* ===================== GROUP BY CASHIER + SHIFT ===================== */
  const cashierShiftSummary = [];

  cashiers.forEach((cashier) => {
    // group sales by shift for this cashier
    const cashierSales = sales.filter((sale) => sale.user_id === cashier.id);

    const shiftsMap = {};
    cashierSales.forEach((sale) => {
      const shiftId = sale.shift_id;
      if (!shiftsMap[shiftId]) {
        shiftsMap[shiftId] = {
          shiftId,
          businessDate: sale.shift?.business_date,
          openedAt: sale.shift?.opened_at,
          closedAt: sale.shift?.closed_at,
          totalSales: 0,
          totalAmount: 0,
        };
      }
      shiftsMap[shiftId].totalSales += 1;
      shiftsMap[shiftId].totalAmount += Number(sale.subtotal || 0);
    });

    Object.values(shiftsMap).forEach((shiftSummary) => {
      cashierShiftSummary.push({
        cashierId: cashier.id,
        cashierName: cashier.full_name,
        ...shiftSummary,
      });
    });
  });

  const grandTotal = cashierShiftSummary.reduce(
    (sum, s) => sum + s.totalAmount,
    0
  );

  /* ===================== UI ===================== */
  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="inline-block animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 py-2">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">Daily Sales Summary</h3>
        <p className="text-sm text-gray-600">Sales report for {today}</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Cashier</th>
              <th className="px-4 py-3 text-left">Shift Date</th>
              <th className="px-4 py-3 text-left">Opened At</th>
              <th className="px-4 py-3 text-left">Closed At</th>
              <th className="px-4 py-3 text-center">Transactions</th>
              <th className="px-4 py-3 text-right">Total Amount</th>
            </tr>
          </thead>

          <tbody className="divide-y text-gray-700">
            {cashierShiftSummary.map((row) => (
              <tr key={`${row.cashierId}-${row.shiftId}`} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{row.cashierName}</td>
                <td className="px-4 py-3">{row.businessDate}</td>
                <td className="px-4 py-3">
                  {row.openedAt ? new Date(row.openedAt).toLocaleString() : "-"}
                </td>
                <td className="px-4 py-3">
                  {row.closedAt ? new Date(row.closedAt).toLocaleString() : "-"}
                </td>
                <td className="px-4 py-3 text-center">{row.totalSales}</td>
                <td className="px-4 py-3 text-right font-semibold">
                  {row.totalAmount.toFixed(2)}
                </td>
              </tr>
            ))}

            {cashierShiftSummary.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No sales for today
                </td>
              </tr>
            )}
          </tbody>

          {/* Footer Grand Total */}
          <tfoot>
            <tr className="bg-gray-100 font-bold">
              <td colSpan="4" className="px-4 py-3">Grand Total</td>
              <td className="px-4 py-3 text-center">{sales.length}</td>
              <td className="px-4 py-3 text-right text-green-600">
                {grandTotal.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default DailySales;
