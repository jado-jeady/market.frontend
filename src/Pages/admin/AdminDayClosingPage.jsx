import { useState } from "react";

const AdminDayClosingPage = () => {
  // Example data that would normally come from backend
  const [closingReport, setClosingReport] = useState({
    cashierName: "John Doe",
    date: new Date().toLocaleDateString(),
    totalSales: 250000,
    totalExpenses: 50000,
    cashInDrawer: 195000,
    expectedCash: 200000,
    notes: "Shortage of 5,000 RWF noticed during reconciliation.",
  });

  const [adminRemarks, setAdminRemarks] = useState("");
  const [status, setStatus] = useState("Pending"); // Pending | Approved | Rejected

  const discrepancy = closingReport.cashInDrawer - closingReport.expectedCash;

  const handleApprove = () => {
    setStatus("Approved");
    alert("Day closing approved successfully!");
    // send approval to backend here
  };

  const handleReject = () => {
    setStatus("Rejected");
    alert("Day closing rejected. Remarks saved.");
    // send rejection + remarks to backend here
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Administrator Day Closing Review</h2>
      <p className="text-xs text-gray-600 mb-6">
        Review cashier’s closing report, check discrepancies, and approve or reject.
      </p>

      {/* Report Summary */}
      <div className="grid grid-cols-2 gap-4 text-green-600 text-xs mb-6">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p><span className="font-semibold">Cashier:</span> {closingReport.cashierName}</p>
          <p><span className="font-semibold">Date:</span> {closingReport.date}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p><span className="font-semibold">Status:</span> {status}</p>
        </div>
      </div>

      {/* Financials */}
      <div className="space-y-2 text-xs text-gray-500 mb-6">
        <div className="flex justify-between">
          <span>Total Sales:</span>
          <span className="font-semibold">{closingReport.totalSales} RWF</span>
        </div>
        <div className="flex justify-between">
          <span>Total Expenses:</span>
          <span className="font-semibold">{closingReport.totalExpenses} RWF</span>
        </div>
        <div className="flex justify-between">
          <span>Cash in Drawer:</span>
          <span className="font-semibold">{closingReport.cashInDrawer} RWF</span>
        </div>
        <div className="flex justify-between">
          <span>Expected Cash:</span>
          <span className="font-semibold">{closingReport.expectedCash} RWF</span>
        </div>
        <div className="flex justify-between">
          <span>Discrepancy:</span>
          <span
            className={`font-semibold ${
              discrepancy === 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {discrepancy === 0
              ? "No discrepancy"
              : `${discrepancy > 0 ? "+" : ""}${discrepancy} RWF`}
          </span>
        </div>
      </div>

      {/* Cashier Notes */}
      <div className="mb-6">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Cashier Notes
        </label>
        <p className="px-3 py-2 text-xs border text-gray-700 rounded-lg bg-gray-50">
          {closingReport.notes || "No notes provided."}
        </p>
      </div>

      {/* Admin Remarks */}
      <div className="mb-6">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Administrator Remarks
        </label>
        <textarea
          value={adminRemarks}
          onChange={(e) => setAdminRemarks(e.target.value)}
          className="w-full px-3 py-2 text-gray-600 text-xs border rounded-lg border-gray-300"
          rows="3"
          placeholder="Add remarks before approving or rejecting..."
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleApprove}
          className="flex-1 bg-green-600 text-white py-2 rounded-lg text-xs hover:bg-green-700"
        >
          Approve Closing
        </button>
        <button
          onClick={handleReject}
          className="flex-1 bg-red-600 text-white py-2 rounded-lg text-xs hover:bg-red-700"
        >
          Reject Closing
        </button>
      </div>
    </div>
  );
};

export default AdminDayClosingPage;