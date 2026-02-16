import { useState } from 'react';
import { updateProduct } from "../../../Utils/product.util"; // Ensure this utility exists

const EditProductModal = ({ isOpen, onClose, product, refresh }) => {
  const [formData, setFormData] = useState({ ...product });

  if (!isOpen) return null;
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(product.id+"   "+formData)
    console.log(formData)
    const success = await updateProduct(product.id,formData);

    if (success) {
      refresh();
      onClose();
      setFormData([])
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                className="w-full border text-gray-400 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Price (RWF)</label>
              <input
                type="number"
                className="w-full border rounded-lg p-2 text-sm text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.selling_price}
                onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Barcode</label>
              <input
                type="text"
                className="w-full border rounded-lg text-gray-500 p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                limit={product.stock_quantity}
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Update Product</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EditProductModal;