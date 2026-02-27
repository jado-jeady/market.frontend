const ConsumablesList = () => {
  const consumables = [
    { id: 1, name: 'Sambusa', icon: '🥟', unit: 'pieces', price: 500, active: true },
    { id: 2, name: 'Mandazi', icon: '🍩', unit: 'pieces', price: 300, active: true },
    { id: 3, name: 'Sausages', icon: '🌭', unit: 'pieces', price: 800, active: true },
    { id: 4, name: 'Chapati', icon: '🫓', unit: 'pieces', price: 400, active: true },
    { id: 5, name: 'Breads', icon: '🍞', unit: 'loaves', price: 1200, active: true },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consumables List</h1>
          <p className="text-gray-600 mt-1">Manage daily fresh food items</p>
        </div>
        <button className="px-6 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:from-orange-700 hover:to-amber-700 transition shadow-md">
          Add New Consumable
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {consumables.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
            <div className="p-6 text-center border-b border-gray-200">
              <div className="text-6xl mb-3">{item.icon}</div>
              <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Unit:</span>
                <span className="font-semibold">{item.unit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Price:</span>
                <span className="font-semibold text-orange-600">RWF {item.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {item.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="pt-3 flex space-x-2">
                <button className="flex-1 py-2 bg-orange-50 text-orange-600 rounded hover:bg-orange-100 transition text-sm font-medium">
                  Edit
                </button>
                <button className="flex-1 py-2 bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition text-sm font-medium">
                  {item.active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsumablesList;