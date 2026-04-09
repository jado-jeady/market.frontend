import { useState } from "react";
import { toast } from "react-toastify";
import { Clock } from "lucide-react";
import { closeShift } from "../../utils/shift.util"; // new util for admin

const AdminCloseShiftModal = ({ isOpen, onClose, shift, onShiftClosed }) => {
  const [closingNote, setClosingNote] = useState("");
  const [loading, setLoading] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser)?.data?.user : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await closeShift({
        shiftId: shift?.id,
        closing_note: closingNote,
        closed_by: user?.id,
      });

      if (response.success) {
        toast.success("Closing note added successfully!");
        onShiftClosed();
        onClose();
        setClosingNote("");
      } else {
        toast.error(response.message || "Failed to add closing note");
      }
    } catch (error) {
      toast.error("An error occurred while adding closing note");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-sm font-bold text-gray-800">
              Admin Closing Note
            </h2>
          </div>

          {shift && (
            <div className="mb-2 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Opened at:</span>{" "}
                {new Date(shift.opened_at).toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Opening Balance:</span>{" "}
                {Number(shift.opening_balance).toLocaleString()} RWF
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Closing Note
              </label>
              <textarea
                value={closingNote}
                onChange={(e) => setClosingNote(e.target.value)}
                className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Enter admin note about this shift..."
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
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
                {loading ? "Saving..." : "Save Note"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCloseShiftModal;
