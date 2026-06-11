import { useState, useEffect } from "react";
import { closeShift } from "../../utils/shift.util";
import { toast } from "react-toastify";
import ShiftSummaryModal from "./ShiftSummaryModel"; // Reusing the same summary modal
import { Clock, Loader2 } from "lucide-react"; // Imported Loader2 for the spinner
import { getAllConsumables } from "../../utils/product.util";

const CloseShiftModal = ({ isOpen, onClose, shift, onShiftClosed }) => {
  const [closingBalance, setClosingBalance] = useState("");
  const [cashInHand, setCashInHand] = useState("");
  const [closingNote, setClosingNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [consumablesLoading, setConsumablesLoading] = useState(false); // New loading state
  const [consumables, setConsumables] = useState([]);
  const [consumableData, setConsumableData] = useState({});
  const [shiftSummaryModelOpen, setShiftSummaryModelOpen] = useState(false);
  const [shiftSummaryData, setShiftSummaryData] = useState(null);
  const [error, setError] = useState("");

  const opening_balance = shift?.opening_balance || 0; // Get opening balance from shift data for validation
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser)?.data?.user : null; // Debug log to check the shift data structure

  const handleQtyChange = (name, value) => {
    setConsumableData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClosingBalanceChange = (val) => {
    setClosingBalance(val);

    // Parse values to float for precise numeric comparison
    const numericVal = parseFloat(val);

    if (!isNaN(numericVal) && numericVal < opening_balance) {
      setError(
        `Warning: Closing balance cannot be lower than the opening balance (${opening_balance} RWF)`,
      );
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!closingBalance || Number(closingBalance) <= 0) {
      toast.error("Closing balance must be greater than 0");
      return;
    }

    setLoading(true);
    try {
      const response = await closeShift({
        shiftId: shift?.id,
        closing_balance: closingBalance,
        closing_note: closingNote,
        cash_in_hand: cashInHand,
        consumables_snapshot: consumableData,
        closed_by: user?.id,
      });

      if (response.success) {
        //set summary data and open summary modal
        setShiftSummaryModelOpen(true);
        setShiftSummaryData(response.data);
        toast.success("Shift closed successfully!");
        onShiftClosed();
        setClosingBalance("");
        setClosingNote("");
        setConsumableData({});
      } else {
        toast.error(response.message || "Failed to close shift");
      }
    } catch (error) {
      toast.error("An error occurred while closing shift");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConsumables = async () => {
    setConsumablesLoading(true); // Start loading
    try {
      const response = await getAllConsumables();
      if (response.success) {
        setConsumables(response.data);
      } else {
        toast.error(response.message || "Failed to fetch consumables");
      }
    } catch (error) {
      toast.error("An error occurred while fetching consumables");
      console.error(error);
    } finally {
      setConsumablesLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchConsumables();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center ml-30 justify-center bg-black/50 z-50 p-2">
      <div className="bg-white rounded-xl shadow-xl w-[90%] max-full-lg">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-">
            <div className="p-2 bg-red-100 rounded-lg">
              <Clock className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-base font-bold text-gray-800">Close Shift</h2>
          </div>

          {shift && (
            <div className="mb-2 p-3 bg-gray-50 rounded-lg grid grid-cols-4 space-y-2 justify-items-left">
              <p className="text-xs text-gray-600">
                <span className="font-medium ">Opened at:</span>
                {"  "}
                {"  "}
                {new Date(shift.opened_at).toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Opening Balance:</span>{" "}
                {Number(shift.opening_balance).toLocaleString()} RWF
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">
              Current Consumables
            </h4>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 min-h-[40px] h-[30vh] items-center mb-10 justify-center overflow-y-scroll">
                {consumablesLoading ? (
                  <div className="flex items-center gap-2 text-gray-500 text-xs py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading consumables...
                  </div>
                ) : (
                  consumables.map((consumable) => (
                    <div key={consumable.id} className="flex flex-col w-28">
                      <label className="text-[10px] font-medium text-gray-700 mb-1 truncate">
                        - {consumable.name}{" "}
                        <span className="text-red-300 ">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        className="w-full text-xs text-gray-900 border border-gray-300 rounded-sm px-2 py-1"
                        placeholder={`${consumable.stock_quantity || 0} in stock`}
                        min="0"
                        value={consumableData[consumable.name] || ""}
                        onChange={(e) =>
                          handleQtyChange(consumable.name, e.target.value)
                        }
                      />
                    </div>
                  ))
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    MOMO Closing Balance (RWF){" "}
                    <span className="text-red-300 ">*</span>
                  </label>
                  <input
                    type="number"
                    value={closingBalance}
                    onChange={(e) => handleClosingBalanceChange(e.target.value)}
                    className={`w-full text-sm text-gray-900 border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none ${
                      error
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                    }`}
                    placeholder="0.00"
                    required
                    min={opening_balance} // Set minimum to opening balance for validation
                  />

                  {error && (
                    <p className="text-xs text-red-600 mt-1 font-medium">
                      {error}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cash in-Hand (RWF) <span className="text-red-300 ">*</span>
                  </label>
                  <input
                    type="number"
                    value={cashInHand}
                    onChange={(e) => setCashInHand(e.target.value)}
                    className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                    min="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Closing Note (Optional)
                </label>
                <textarea
                  value={closingNote}
                  onChange={(e) => setClosingNote(e.target.value)}
                  className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Enter any notes about this shift..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || consumablesLoading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Closing...
                    </div>
                  ) : (
                    "Close Shift"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {shiftSummaryModelOpen && (
        <ShiftSummaryModal
          isOpen={shiftSummaryModelOpen}
          onClose={() => {
            setShiftSummaryModelOpen(false);
            onClose();
          }}
          shiftData={shiftSummaryData}
        />
      )}
    </div>
  );
};

export default CloseShiftModal;
