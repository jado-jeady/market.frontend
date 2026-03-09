import { useState, useEffect } from "react";

const DayClosing = () => {
  const [closingData, setClosingData] = useState({
    totalSales: 0,
    totalExpenses: 0,
    cashInDrawer: "",
    expectedCash: 0,
    notes: "",
  });

  const [discrepancy, setDiscrepancy] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClosingData((prev) => ({ ...prev, [name]: value }));
  };

  // Auto-calculate expected cash and discrepancy
  useEffect(() => {
    const expected = Number(closingData.totalSales) - Number(closingData.totalExpenses);
    setClosingData((prev) => ({ ...prev, expectedCash: expected }));

    const actual = Number(closingData.cashInDrawer);
    setDiscrepancy(actual - expected);
  }, [closingData.totalSales, closingData.totalExpenses, closingData.cashInDrawer]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Number(closingData.cashInDrawer) < 0) {
      alert("Cash in drawer cannot be negative.");
      return;
    }

    if (discrepancy !== 0) {
      if (!window.confirm("There is a cash discrepancy. Do you still want to submit?")) {
        return;
      }
    }

    // Send closingData to backend here
    console.log("Day closing submitted:", closingData);
    alert("Day closing report submitted successfully!");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Day Closing Report</h2>
      <p className="text-xs text-gray-600 mb-6">
        Review today’s sales, reconcile cash, and record notes before closing.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Sales Summary */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Total Sales (RWF)
          </label>
          <input
            type="number"
            name="totalSales"
            value={closingData.totalSales}
            onChange={handleChange}
            placeholder="total Sales"
            className="w-full px-3 py-2 text-gray-400 text-xs border rounded-lg border-gray-300"
          />
        </div>

        {/* Expenses */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Total Expenses (RWF)
          </label>
          <input
            type="number"
            name="totalExpenses"
            value={closingData.totalExpenses}
            onChange={handleChange}
            min={0}
            placeholder="Today's total expenses"
            className="w-full px-3 py-2 text-xs text-gray-400 border rounded-lg border-gray-300"
          />
        </div>

        {/* Cash Reconciliation */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Cash in Drawer (RWF)
          </label>
          <input
            type="number"
            name="cashInDrawer"
            value={closingData.cashInDrawer}
            onChange={handleChange}
            placeholder="Cash in Drawer"
            min={0}
            className="w-full px-3 py-2 text-gray-400 text-xs border rounded-lg border-gray-300"
          />
        </div>

        {/* Expected Cash (auto-calculated) */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Expected Cash (RWF)
          </label>
          <input
            type="number"
            name="expectedCash"
            value={closingData.expectedCash}
            readOnly
            className="w-full px-3 py-2 text-xs border rounded-lg border-gray-300 bg-gray-100"
          />
        </div>

        {/* Discrepancy */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Discrepancy (Cash in Drawer - Expected)
          </label>
          <p
            className={`px-3 py-2 text-xs rounded-lg ${
              discrepancy === 0
                ? "text-green-600 bg-green-50"
                : "text-red-600 bg-red-50"
            }`}
          >
            {discrepancy === 0
              ? "No discrepancy"
              : `${discrepancy > 0 ? "+" : ""}${discrepancy} RWF`}
          </p>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Notes / Observations
          </label>
          <textarea
            name="notes"
            value={closingData.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 text-gray-400 text-xs border rounded-lg border-gray-300"
            rows="3"
            placeholder="Record any discrepancies, issues, or remarks..."
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-gray-700 text-white py-2 rounded-lg text-xs hover:bg-gray-800"
        >
          Submit Day Closing
        </button>
      </form>
    </div>
  );
};

export default DayClosing;