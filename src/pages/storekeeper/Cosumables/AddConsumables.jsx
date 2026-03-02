import { useState, useEffect } from 'react';
import { createProduction } from '../../../utils/storekeeper.utils';

const AddProduction = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    product_id: '',
    quantity: '',
    productionTime: '',
    notes: '',
  });
const userToken = JSON.parse(localStorage.getItem("user")).token
  const [selectedItems, setSelectedItems] = useState([]);

  /* ============================================
     FETCH CONSUMABLE PRODUCTS FROM BACKEND
  ============================================ */
  useEffect(() => {
    const fetchConsumables = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + '/api/products?product_type=Consumable');
        const data = await res.json();
        setProducts(data.data || []);
      } catch (err) {
        console.error('Failed to fetch consumables', err);
      }
    };

    fetchConsumables();
  }, []);

  /* ============================================
     ADD ITEM TO BATCH
  ============================================ */
  const handleAddItem = () => {
    if (!formData.product_id || !formData.quantity) {
      alert('Please select item and enter quantity');
      return;
    }

    const product = products.find(p => p.id === parseInt(formData.product_id));

    const newItem = {
      id: Date.now(),
      product_id: product.id,
      name: product.name,
      quantity: parseInt(formData.quantity),
      productionTime:new Date().toLocaleTimeString(),
      notes: formData.notes,
    };

    setSelectedItems([...selectedItems, newItem]);

    setFormData({
      product_id: '',
      quantity: '',
      productionTime: '',
      notes: '',
    });
  };

  const handleRemoveItem = (id) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id));
  };

  /* ============================================
     SUBMIT PRODUCTION
  ============================================ */
 const handleSubmitProduction = async () => {
  if (selectedItems.length === 0) {
    alert("Please add at least one item");
    return;
  }

  const payload = {
    items: selectedItems.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      production_time: item.productionTime,
      notes: item.notes,
    })),
  };

  console.log("Submitting payload:", payload);

  try {
    const response = await createProduction(payload);

    if (response.success) {
      alert("Production submitted successfully!");
      setSelectedItems([]);
    } else {
      alert("Failed to submit production");
      console.error(response);
    }
  } catch (error) {
    console.error("Error submitting production:", error);
    alert("Failed to submit production");
  }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          Add Production
        </h3>
        <p className=" text-xs text-gray-600 mt-1">
          Record newly produced consumables
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">

          {/* PRODUCT SELECT */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Select Consumable
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() =>
                    setFormData({ ...formData, product_id: product.id })
                  }
                  className={`p-1 rounded-lg border-2 transition-all ${
                    formData.product_id === product.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900">
                    {product.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* PRODUCTION DETAILS */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold border-bottom-1 border-green-300 text-gray-900 mb-4">
              Production Details
            </h3>

            <div className="space-y-4 text-gray-700">
              <label className="block text-xs font-medium">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                required
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Enter quantity"
                min="1"
              />
              
              <label className="block text-xs font-medium">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Notes..."
              />

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
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h3 className="font-semibold text-gray-900 mb-4">
              Current Batch ({selectedItems.length})
            </h3>

            {selectedItems.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No items added yet
              </p>
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

                <button
                  onClick={handleSubmitProduction}
                  className="w-full py-3 bg-orange-600 text-white rounded-lg"
                >
                  Submit Production
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