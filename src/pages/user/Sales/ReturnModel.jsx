import { useState } from "react";

const ReturnModal = ({ sale, onClose }) => {
  console.log(sale);
  const [returnItems, setReturnedItems] = useState(
    sale.items.map((item) => ({
      product_id: item.product_id,
      name: item.product.name,
      maxQty: item.quantity,
      qty: null,
      reason: "",
    })),
  );

  const handleChange = (index, field, value) => {
    const updated = [...returnItems];
    updated[index][field] = value;
    setReturnedItems(updated);
  };

  const handleSubmit = () => {
    // Only include items with qty > 0
    const filtered = returnItems.filter((item) => item.qty > 0);
    console.log(filtered);
    onClose();
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
                  value={item?.quantity}
                  placeholder="Qty"
                  onChange={(e) =>
                    handleChange(idx, "qty", Number(e.target.value))
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
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="text-gray-500 text-xs hover:underline"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700"
          >
            Submit Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnModal;
