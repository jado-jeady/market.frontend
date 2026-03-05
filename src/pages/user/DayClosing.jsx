import { useState, useEffect } from "react";
import { openShift, getCurrentShift, closeShift } from "../../utils/shift.util";

const ShiftManager = () => {
  const [shift, setShift] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const response = await getCurrentShift();
      if (response.success) setShift(response.data);
      setLoading(false);
    })();
  }, []);

  const handleOpenShift = async () => {
    const opening_balance = prompt("Enter opening balance:");
    const response = await openShift({ opening_balance });
    if (!response.success) {
      alert(response.message);
    } else {
      setShift(response.data);
    }
  };

  const handleCloseShift = async () => {
    const closingBalance = prompt("Enter closing balance:");
    const response = await closeShift({ shiftId: shift.id, closingBalance });
    if (!response.success) {
      alert(response.message);
    } else {
      alert("Shift closed successfully!");
      setShift(null);
    }
  };

  const handleAbortShift = async () => {
    if (!window.confirm("Abort this shift? All sales will be deleted!")) return;
    const response = await abortShift({ shiftId: shift.id });
    if (!response.success) {
      alert(response.message);
    } else {
      alert("Shift aborted successfully!");
      setShift(null);
    }
  };

  if (loading) return <p>Loading shift...</p>;

  return (
    <div className="p-6">
      {!shift ? (
        <button
          onClick={handleOpenShift}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Open Shift
        </button>
      ) : (
        <div className="space-y-4">
          <p>
            Active Shift: #{shift.id} | Status: {shift.status} | Opened at:{" "}
            {new Date(shift.opened_at).toLocaleString()}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleCloseShift}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Close Shift
            </button>
            <button
              onClick={handleAbortShift}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Abort Shift
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftManager;