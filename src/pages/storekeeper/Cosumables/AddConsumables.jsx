import { useState, useEffect } from "react";
import { createProduction } from "../../../utils/storekeeper.utils";
import { toast } from "react-toastify"; // ✅ make sure you have react-toastify installed

const AddProduction = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    product_id: "",
    quantity: "",
    notes: "",
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ track loading state

  useEffect(() => {
    const fetchConsumables = async () => {
      try {
        const res = await fetch(
          import.meta.env.VITE_API_URL + "/api/products?product_type=Consumable"
        );
        const data = await res.json();
        setProducts(data.data || []);
      } catch (err) {
        console.error("Failed to fetch consumables", err);
        toast.error("Failed to load consumables");
      }
    };
    fetchConsumables();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.product_id) newErrors.product_id = "Please select a product.";
    if (!formData.quantity || Number(formData.quantity) <= 0)
      newErrors.quantity = "Quantity must be greater than 0.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddItem = () => {
    if (!validateForm()) return;

    const product = products.find(
      (p) => p.id === parseInt(formData.product_id)
    );

    const newItem = {
      id: Date.now(),
      product_id: product.id,
      name: product.name,
      quantity: parseInt(formData.quantity),
      productionTime: new Date().toLocaleTimeString(),
      notes: formData.notes,
    };

    setSelectedItems([...selectedItems, newItem]);
    setFormData({ product_id: "", quantity: "", notes: "" });
    setErrors({});
  };

  const handleRemoveItem = (id) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== id));
  };

  const handleSubmitProduction = async () => {
    if (selectedItems.length === 0) {
      setErrors({ submit: "Please add at least one item before submitting." });
      return;
    }

    const payload = {
      items: selectedItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        production_time: item.productionTime,
        notes: item.notes,
      })),
    };

    setIsSubmitting(true); // ✅ start loading
    try {
      const response = await createProduction(payload);

      if (response.success) {
        toast.success("Production successfully send for approval !");
        setSelectedItems([]);
        setErrors({});
      } else {
        toast.error(response.message || "Failed to submit production");
      }
    } catch (error) {
      console.error("Error submitting production:", error);
      toast.error("Error submitting production");
    } finally {
      setIsSubmitting(false); // ✅ stop loading
    }
  };

  return (
    <div className="py-2 md:px-5 w-full">
      <div className="mb-2 px-4 md:px-6">
        <h3 className="text-xl font-bold text-gray-900">Add Production</h3>
        <p className="text-xs text-gray-600 mt-1">
          Record newly produced consumables
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Select */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Select Consumable
            </h3>
            {errors.product_id && (
              <p className="text-red-500 text-xs mb-2">{errors.product_id}</p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() =>
                    setFormData({ ...formData, product_id: product.id })
                  }
                  className={`p-2 rounded-lg border-2 text-gray-600 text-sm transition-all ${
                    formData.product_id === product.id
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                >
                  {product.name}
                </button>
              ))}
            </div>
          </div>

          {/* Production Details */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Production Details
            </h3>

            <div className="space-y-4 text-gray-700">
              <div>
                <label className="block mb-2 text-xs font-medium">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Enter quantity"
                  min="1"
                />
                {errors.quantity && (
                  <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
                )}
              </div>

              <div>
                <label className="block text-xs mb-2 font-medium">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Notes..."
                />
              </div>

              <button
                onClick={handleAddItem}
                className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                Add to Batch
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE BATCH */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 sticky top-20">
            <h3 className="font-semibold text-gray-900 mb-4">
              Current Batch ({selectedItems.length})
            </h3>

            {selectedItems.length === 0 ? (
              <p className="text-gray-500 text-sm">No items added yet</p>
            ) : (
              <>
                <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                  {selectedItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gray-500 rounded-lg p-3 border"
                    >
                      <div className="flex justify-between">
                        <span className="font-medium text-white">
                          {item.name}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="text-xs text-white mt-1">
                        Qty: {item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {errors.submit && (
                  <p className="text-red-500 text-xs mb-2">{errors.submit}</p>
                )}

                <button
                  onClick={handleSubmitProduction}
                  disabled={isSubmitting} // ✅ disable while loading
                  className={`w-full py-3 rounded-lg text-white transition ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-orange-600 hover:bg-orange-700"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit Production"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduction;