import { useState } from "react";
import { createReturn } from "../../../utils/sales.util";
import { toast } from "react-toastify";

const ReturnModal = ({ sale, onClose, userId, token }) => {
  const [returnItems, setReturnedItems] = useState(
    sale.items.map((item) => ({
      product_id: item.product_id,
      name: item.product.name,
      maxQty: item.quantity,
      quantity: null,
      sale_item_id: item.id,
      reason: "",
    })),
  );
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (index, field, value) => {
    const updated = [...returnItems];
    updated[index][field] = value;

    const newErrors = { ...errors };
    if (field === "quantity" && Number(value) > updated[index].maxQty) {
      newErrors[index] = `Quantity cannot exceed ${updated[index].maxQty}`;
    } else {
      delete newErrors[index];
    }

    setReturnedItems(updated);
    setErrors(newErrors);
  };

  const handleSubmit = async () => {
    const filtered = returnItems.filter((item) => item.quantity > 0);

    if (filtered.length === 0) {
      toast.info("Please select at least one item to return");
      return;
    }

    try {
      setLoading(true);
      await createReturn(sale.id, filtered);

      toast.success("Return request submitted!");
      onClose();
      // Refresh the list if you have a refresh function
    } catch (err) {
      // Check for the specific "exists" error
      if (err.message.includes("already exist")) {
        toast.warning(
          "⚠️ This return is already pending. You cannot submit it again.",
        );
      } else {
        toast.error(err.message || "Failed to submit return");
      }
      console.error("Return Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-30 z-50">
      <div className="bg-white rounded-lg text-gray-800 shadow-lg w-[400px] p-4">
        <h2 className="text-sm font-semibold mb-3">
          Return Items for Invoice {sale.invoice_number}
        </h2>

        <div className="space-y-3 max-h-100 overflow-y-auto">
          {returnItems.map((item, idx) => (
            <div key={item.product_id} className="flex flex-col space-y-1">
              <span className="text-xs font-medium">{item.name}</span>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="0"
                  max={item.maxQty}
                  value={item?.quantity || ""}
                  placeholder="Qty"
                  onChange={(e) =>
                    handleChange(idx, "quantity", Number(e.target.value))
                  }
                  className="w-16 border rounded px-1 py-1 text-xs"
                />
                <input
                  type="text"
                  placeholder="Reason"
                  value={item.reason}
                  onChange={(e) => handleChange(idx, "reason", e.target.value)}
                  className="flex-1 border rounded px-2 py-1 text-xs"
                />
              </div>
              {errors[idx] && (
                <p className="text-red-500 text-xs mt-1">{errors[idx]}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="text-gray-500 text-xs hover:underline"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white text-xs px-3 py-1 rounded`}
          >
            {loading ? "Submitting..." : "Submit Return"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnModal;
