import { useEffect, useState } from "react";
import { getSalesByShift } from "../../../utils/sales.util";

const CashierShiftSales = () => {
  
  const authData = JSON.parse(localStorage.getItem("user"));
  const cashierId = authData?.data?.user?.id;

  const [sales, setSales] = useState([]);
  const [businessDates, setBusinessDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchSales = async () => {
      console.log("Cashier ID:", cashierId);
      const res = await getSalesByShift({ cashierId });
      if (res.success) {
        console.log("Sales response:", res.data);
        console.log(res.data);
        setSales(res.data);
        const dates = [...new Set(res.data.map((s) => s.shift?.business_date))];
        setBusinessDates(dates);
      }
    };
    fetchSales();
  }, [cashierId]);

  const filteredSales = selectedDate
    ? sales.filter((s) => s.shift?.business_date === selectedDate)
    : [];

  const totalAmount = filteredSales.reduce(
    (sum, s) => sum + Number(s.subtotal || 0),
    0
  );

  return (
    <div className="p-6 text-gray-600">
      <h3 className="text-lg font-bold mb-2">Cashier Sales by Shift</h3>

      <div className="mb-4">
        <label className="text-sm mr-2">Select Business Date:</label>
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">-- Choose Date --</option>
          {businessDates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
      </div>

      {selectedDate && filteredSales.length > 0 ? (
        <table className="w-full text-sm text-gray-600 bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Invoice</th>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-center">Date</th>
              <th className="px-3 py-2 text-right">Amount</th>
              <th className="px-3 py-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="px-3 py-2">{sale.invoice_number}</td>
                <td className="px-3 py-2">{sale.customer_name || "Walk-in"}</td>
                <td className="px-3 py-2 text-center">
                  {sale.created_at?.slice(0, 10)}
                </td>
                <td className="px-3 py-2 text-right">
                  {Number(sale.subtotal).toFixed(2)}
                </td>
                <td className="px-3 py-2 text-center">{sale.status}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold">
              <td colSpan="3" className="px-3 py-2 text-right">
                Total
              </td>
              <td className="px-3 py-2 text-right text-green-600">
                {totalAmount.toFixed(2)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      ) : (
        <p className="text-gray-500">Select A bussiness date to view Your sales</p>
      )}
    </div>
  );
};

export default CashierShiftSales;