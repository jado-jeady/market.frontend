import { useEffect, useState } from "react";
import { getAllSales, getCashiers } from "../../../utils/sales.util";

const DailySales = () => {
  /* ===================== STATE ===================== */
  const [sales, setSales] = useState([]);
  const [cashiers, setCashiers] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().slice(0, 10);

  /* ===================== FETCH ===================== */

  const fetchData = async () => {
    setLoading(true);

    const salesResponse = await getAllSales({
      limit: 1000000,
      page: 1,
    });

    const cashierResponse = await getCashiers();

    if (salesResponse?.success) {
      setSales(salesResponse.data);
    }

    if (cashierResponse?.success) {
      setCashiers(cashierResponse.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ===================== FILTER TODAY ===================== */

  const todaySales = sales.filter(
    (sale) =>
      sale.created_at?.slice(0, 10) === today &&
      sale.status === "COMPLETED"
  );

  /* ===================== GROUP BY CASHIER ===================== */

  const cashierSummary = cashiers.map((cashier) => {
    const cashierSales = todaySales.filter(
      (sale) => sale.user_id === cashier.id
    );

    const totalAmount = cashierSales.reduce(
      (sum, sale) => sum + Number(sale.subtotal || 0),
      0
    );

    return {
      cashierId: cashier.id,
      name: cashier.full_name,
      totalSales: cashierSales.length,
      totalAmount,
    };
  });

  const grandTotal = cashierSummary.reduce(
    (sum, cashier) => sum + cashier.totalAmount,
    0
  );

  /* ===================== UI ===================== */

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-primary-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 py-2">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          Daily Sales Summary
        </h3>
        <p className="text-sm text-gray-600">
          Sales report for {today}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Cashier</th>
              <th className="px-4 py-3 text-center">
                Transactions
              </th>
              <th className="px-4 py-3 text-right">
                Total Amount
              </th>
            </tr>
          </thead>

          <tbody className="divide-y text-gray-700">
            {cashierSummary.map((cashier) => (
              <tr key={cashier.cashierId} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">
                  {cashier.name}
                </td>

                <td className="px-4 py-3 text-center">
                  {cashier.totalSales}
                </td>

                <td className="px-4 py-3 text-right font-semibold">
                  {cashier.totalAmount.toFixed(2)}
                </td>
              </tr>
            ))}

            {cashierSummary.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-500">
                  No sales for today
                </td>
              </tr>
            )}
          </tbody>

          {/* Footer Grand Total */}
          <tfoot>
            <tr className="bg-gray-100 font-bold">
              <td className="px-4 py-3">Grand Total</td>
              <td className="px-4 py-3 text-center">
                {todaySales.length}
              </td>
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
