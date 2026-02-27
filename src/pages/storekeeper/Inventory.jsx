const Inventory = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Consumables Inventory</h1>
        <p className="text-gray-600 mt-1">Current stock levels of all consumables</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Sambusa', icon: '🥟', current: 45, target: 100, sold: 55, status: 'Low' },
          { name: 'Mandazi', icon: '🍩', current: 90, target: 150, sold: 60, status: 'Good' },
          { name: 'Sausages', icon: '🌭', current: 15, target: 50, sold: 35, status: 'Critical' },
          { name: 'Chapati', icon: '🫓', current: 85, target: 100, sold: 15, status: 'Good' },
          { name: 'Breads', icon: '🍞', current: 50, target: 80, sold: 30, status: 'Good' },
        ].map((item, i) => {
          const percentage = (item.current / item.target) * 100;
          const statusColor = item.status === 'Critical' ? 'red' : item.status === 'Low' ? 'yellow' : 'green';
          
          return (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-4">
                <span className="text-5xl">{item.icon}</span>
                <span className={`px-3 py-1 bg-${statusColor}-100 text-${statusColor}-700 rounded-full text-xs font-medium`}>
                  {item.status}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">{item.name}</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Stock:</span>
                  <span className="text-lg font-bold text-orange-600">{item.current}</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`bg-${statusColor}-500 h-3 rounded-full transition-all`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Target: {item.target}</span>
                  <span>Sold: {item.sold}</span>
                </div>
              </div>
              
              <button className="w-full mt-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition font-medium">
                Add Production
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Inventory;