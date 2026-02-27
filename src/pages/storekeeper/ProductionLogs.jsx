const ProductionLog = () => {
  const today = new Date().toLocaleDateString();
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Production Log</h1>
        <p className="text-gray-600 mt-1">Daily production history and records</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Today's Production Summary - {today}</h3>
        <div className="grid grid-cols-5 gap-4">
          {[
            { name: 'Sambusa', icon: '🥟', produced: 150 },
            { name: 'Mandazi', icon: '🍩', produced: 120 },
            { name: 'Sausages', icon: '🌭', produced: 80 },
            { name: 'Chapati', icon: '🫓', produced: 100 },
            { name: 'Breads', icon: '🍞', produced: 60 },
          ].map((item, i) => (
            <div key={i} className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-4xl mb-2">{item.icon}</div>
              <div className="font-semibold text-gray-900">{item.name}</div>
              <div className="text-2xl font-bold text-orange-600 mt-1">{item.produced}</div>
              <div className="text-xs text-gray-500">pieces</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <h3 className="font-semibold">Production History (Last 7 Days)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Item</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Time</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-600 divide-gray-200">
              {[...Array(15)].map((_, i) => (
                <tr key={i} className="hover:bg-gray-50 text-gray-600">
                  <td className="px-6 py-4 text-sm">2024-01-{String(30 - Math.floor(i / 3)).padStart(2, '0')}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {['Sambusa', 'Mandazi', 'Chapati'][i % 3]}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold">{Math.floor(Math.random() * 100 + 50)}</td>
                  <td className="px-6 py-4 text-sm">{8 + Math.floor(i / 2)}:00 AM</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      Approved
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductionLog;