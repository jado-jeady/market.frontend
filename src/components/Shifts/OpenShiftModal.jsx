import { useEffect, useState } from "react";
import { openShift } from "../../utils/shift.util";
import { toast } from "react-toastify";
import { Coffee } from "lucide-react";
import { getAllConsumables } from "../../utils/product.util";

const OpenShiftModal = ({ isOpen, onClose, onShiftOpened }) => {
  const [openingBalance, setOpeningBalance] = useState("");
  const [shiftNote, setShiftNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [consumables, setConsumables] = useState([]);

  useEffect(() => {
    fetchConsumables();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!openingBalance || openingBalance <= 0) {
      toast.error("Opening balance must be greater than 0");
      return;
    }

    setLoading(true);
    try {
      const start_time = new Date().toISOString();
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser)?.data?.user : null;

      const response = await openShift({
        opening_balance: openingBalance,
        start_time,
        shop_name: "Tyag_market",
        user_id: user?.id,
        opening_note: shiftNote,
      });

      if (response.success) {
        toast.success("Shift opened successfully!");
        onShiftOpened(response.data);
        onClose();
        setOpeningBalance("");
        setShiftNote("");
      } else {
        toast.error(response.message || "Failed to open shift");
      }
    } catch (error) {
      toast.error("An error occurred while opening shift");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // getting all consumables
  const fetchConsumables = async () => {
    try {
      const data = await getAllConsumables();
      console.log("COnsumables", data);

      setConsumables(data || []);
    } catch (error) {
      console.error("Failed to fetch consumables:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Coffee className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Open Shift</h2>
          </div>

          <p className="text-gray-600 mb-4">
            Enter the opening balance and any notes for this shift.
          </p>

          <p className="text-gray-600 mb-4">
            <span className="font-semibold">Consumables:</span>{" "}
            {consumables.data.map((consumable) => consumable.name).join(", ")}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opening Balance (RWF)
                </label>
                <input
                  type="number"
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(e.target.value)}
                  className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shift Note (Optional)
                </label>
                <textarea
                  value={shiftNote}
                  onChange={(e) => setShiftNote(e.target.value)}
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
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Opening...
                    </div>
                  ) : (
                    "Open Shift"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OpenShiftModal;
