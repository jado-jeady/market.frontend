import { useState, useEffect } from "react";
import { getAllShifts, closeShift, abortShift } from "../../../utils/shift.util";

const GetShifts = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await getAllShifts({limit:1000000,page:1});
      if (response.success) setShifts(response.data);
      setLoading(false);
    })();
  }, []);

  const handleCloseShift = async (shiftId) => {
    const response = await closeShift({ shiftId, closingBalance });
    if (response.success) {
      alert("Shift closed successfully!");
      setShifts((prev) =>
        prev.map((s) => (s.id === shiftId ? { ...s, status: "CLOSED" } : s))
      );
    } else {
      alert(response.message);
    }
  };

  const handleAbortShift = async (shiftId) => {
    if (!window.confirm("Abort this shift? All sales will be deleted!")) return;
    const response = await abortShift({ shiftId });
    if (response.success) {
      alert("Shift aborted successfully!");
      setShifts((prev) => prev.filter((s) => s.id !== shiftId));
    } else {
      alert(response.message);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading shifts...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Shift Management</h2>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Shift ID</th>
              <th className="px-4 py-3 text-left">Cashier</th>
              <th className="px-4 py-3 text-left">Shop</th>
              <th className="px-4 py-3 text-left">Opened At</th>
              <th className="px-4 py-3 text-left">Closed At</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Opening Balance</th>
              <th className="px-4 py-3 text-right">Closing Balance</th>
              <th className="px-4 py-3 text-right">Total Sales</th>
              <th className="px-4 py-3 text-right">Difference</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-gray-700">
            {shifts.map((shift) => (
              <tr key={shift.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{shift.id}</td>
                <td className="px-4 py-3">{shift.cashier_id}</td>
                <td className="px-4 py-3">{shift.shop_name}</td>
                <td className="px-4 py-3">
                  {shift.opened_at
                    ? new Date(shift.opened_at).toLocaleString()
                    : "-"}
                </td>
                <td className="px-4 py-3">
                  {shift.closed_at
                    ? new Date(shift.closed_at).toLocaleString()
                    : "-"}
                </td>
                <td className="px-4 py-3 text-center">{shift.status}</td>
                <td className="px-4 py-3 text-right">
                  {shift.opening_balance || "-"}
                </td>
                <td className="px-4 py-3 text-right">
                  {shift.closing_balance || "-"}
                </td>
                <td className="px-4 py-3 text-right">
                  {shift.total_sales || 0}
                </td>
                <td className="px-4 py-3 text-right">
                  {shift.difference || 0}
                </td>
                <td className="px-4 py-3 text-center space-x-2">
                  {shift.status === "OPEN" && (
                    <>
                      <button
                        onClick={() => handleCloseShift(shift.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => handleAbortShift(shift.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Abort
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {shifts.length === 0 && (
              <tr>
                <td
                  colSpan="11"
                  className="text-center py-6 text-gray-500"
                >
                  No shifts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetShifts;