import { useState } from 'react';

const AddProduction = () => {
  const [formData, setFormData] = useState({
    itemType: '',
    quantity: '',
    productionTime: '',
    expiryTime: '',
    notes: '',
  });

  const [selectedItems, setSelectedItems] = useState([]);

  const consumableTypes = [
    { 
      id: 'sambusa', 
      name: 'Sambusa', 
      icon: '🥟',
      shelfLife: '8 hours',
      unit: 'pieces'
    },
    { 
      id: 'mandazi', 
      name: 'Mandazi', 
      icon: '🍩',
      shelfLife: '12 hours',
      unit: 'pieces'
    },
    { 
      id: 'sausages', 
      name: 'Sausages', 
      icon: '🌭',
      shelfLife: '6 hours',
      unit: 'pieces'
    },
    { 
      id: 'chapati', 
      name: 'Chapati', 
      icon: '🫓',
      shelfLife: '10 hours',
      unit: 'pieces'
    },
    { 
      id: 'breads', 
      name: 'Breads', 
      icon: '🍞',
      shelfLife: '24 hours',
      unit: 'loaves'
    },
  ];

  const handleAddItem = () => {
    if (!formData.itemType || !formData.quantity) {
      alert('Please select item type and enter quantity');
      return;
    }

    const item = consumableTypes.find(c => c.id === formData.itemType);
    const newItem = {
      id: Date.now(),
      ...item,
      quantity: parseInt(formData.quantity),
      productionTime: formData.productionTime || new Date().toLocaleTimeString(),
      notes: formData.notes,
    };

    setSelectedItems([...selectedItems, newItem]);
    
    // Reset form
    setFormData({
      itemType: '',
      quantity: '',
      productionTime: '',
      expiryTime: '',
      notes: '',
    });
  };

  const handleRemoveItem = (id) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id));
  };

  const handleSubmitProduction = async () => {
    if (selectedItems.length === 0) {
      alert('Please add at least one item');
      return;
    }

    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch('/api/storekeeper/production/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: selectedItems,
          submittedBy: 'Storekeeper', // Replace with actual user
          submittedAt: new Date().toISOString(),
          status: 'pending',
        }),
      });

      if (response.ok) {
        alert('Production submitted for approval!');
        setSelectedItems([]);
      }
    } catch (error) {
      console.error('Error submitting production:', error);
      alert('Failed to submit production');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Production</h1>
        <p className="text-gray-600 mt-1">Record newly produced consumables for approval</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Production Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Select Buttons */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Select Item Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {consumableTypes.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setFormData({ ...formData, itemType: item.id })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.itemType === item.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{item.shelfLife}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Production Details Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Production Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Item
                </label>
                <input
                  type="text"
                  value={consumableTypes.find(c => c.id === formData.itemType)?.name || 'None'}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Enter quantity"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Production Time (Optional)
                </label>
                <input
                  type="time"
                  value={formData.productionTime}
                  onChange={(e) => setFormData({ ...formData, productionTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to use current time</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Any special notes about this batch..."
                />
              </div>

              <button
                onClick={handleAddItem}
                className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium shadow-md"
              >
                Add to Batch
              </button>
            </div>
          </div>
        </div>

        {/* Current Batch */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
              <span>Current Batch</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                {selectedItems.length} items
              </span>
            </h3>

            {selectedItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm">No items added yet</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                            <p className="text-xs text-gray-600">{item.quantity} {item.unit}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="text-xs text-gray-600">
                        <div>⏰ {item.productionTime}</div>
                        <div>📅 Expires: {item.shelfLife}</div>
                        {item.notes && <div className="mt-1">📝 {item.notes}</div>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Total Items:</span>
                    <span className="font-semibold">{selectedItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Item Types:</span>
                    <span className="font-semibold">{selectedItems.length}</span>
                  </div>
                </div>

                <button
                  onClick={handleSubmitProduction}
                  className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition font-semibold shadow-lg"
                >
                  Submit for Approval
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