import { useEffect, useState } from "react";
import { getAllSales, getCashiers } from "../../../Utils/sales.util";

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

    {/* Grid Layout */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cashierSummary.map((cashier) => (
        <div
          key={cashier.cashierId}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
        >
          <h4 className="text-lg font-semibold text-gray-800">
            {cashier.name}
          </h4>
          <p className="text-sm text-gray-600">
            Transactions: <span className="font-medium">{cashier.totalSales}</span>
          </p>
          <p className="text-sm text-gray-600">
            Total Amount:{" "}
            <span className="font-semibold text-green-600">
              {cashier.totalAmount.toFixed(2)} frw
            </span>
          </p>
        </div>
      ))}

      {cashierSummary.length === 0 && (
        <div className="col-span-full text-center py-6 text-gray-500">
          No sales for today
        </div>
      )}
    </div>

    {/* Grand Total */}
    <div className="mt-6 text-gray-700 bg-gray-100 rounded-lg p-4 font-bold flex justify-between items-center">
      <span>Grand Total</span>
      <span>{todaySales.length} transactions</span>
      <span className="text-green-600">{grandTotal.toFixed(2)} Frw</span>
    </div>
  </div>
);
};

export default DailySales;
