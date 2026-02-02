import { useState } from 'react';

const ReceiveStock = () => {
  const [formData, setFormData] = useState({
    product: '',
    quantity: '',
    supplier: '',
    reference: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // API call here
    alert('Stock received successfully!');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Receive Stock</h1>
        <p className="text-gray-600 mt-1">Record incoming stock deliveries</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Product <span className="text-red-500">*</span>
            </label>
            <select
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="">Choose a product</option>
              <option>Product A</option>
              <option>Product B</option>
              <option>Product C</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity Received <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="Enter quantity"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplier
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="Supplier name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference Number
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="PO or delivery reference"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition shadow-md"
          >
            Receive Stock
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReceiveStock;
