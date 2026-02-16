import { useState } from "react";
import { toast } from "react-toastify";
import { adjustStock } from "../../../Utils/product.util";
const StockAdjustmentModal = ({ isOpen, onClose, product, refresh }) => {
  const [type, setType] = useState("IN");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [QuantityError, setQauntityError] = useState('');

  if (!isOpen) return null;

const handleClose = () => {
  // Reset all local states to default
  setType("IN");
  setQuantity("");
  setReason("");
  setQauntityError("");
  // Finally, call the parent's onClose
  onClose();
};
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(quantity<=0 ){
      setQauntityError("Quantity Must Be greather than zero")
      return;
    }
    if(type==="OUT" && quantity> product.stock_quantity){
      setQauntityError("You can't remove stock you don't Have!");
      return;
    }
    

    try {
      const response = await adjustStock({
        product_id: product.id,
        type,
        quantity: Number(quantity),
        reason,
        barcode: product.barcode
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to adjust stock");
      }

      toast.success("Stock adjusted successfully");
      refresh();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adjusting stock");
    }
  };

  return (
    <div className="fixed text-gray-600 inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-[450px] rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Adjust Stock - {product.name}
        </h2>

       <div className="flex justify-between mb-4 text-sm ">
         <p className="">
          <span>Current Stock: <strong>{product.stock_quantity}</strong></span>
        </p>
        <p>
          <span>Product Barcode: <strong>{product.barcode}</strong></span>
        </p>
       </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="IN">Stock In</option>
            <option value="OUT">Stock Out</option>
          </select>

          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            min={0}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <p className="text-sm text-red-600 ">{QuantityError}</p>
          

          <input
            type="text"
            placeholder="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockAdjustmentModal;
