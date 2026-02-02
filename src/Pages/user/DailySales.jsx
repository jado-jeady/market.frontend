const DailySales = () => {
  const today = new Date().toLocaleDateString();
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Daily Sales Report</h1>
        <p className="text-gray-600 mt-1">{today}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Total Sales</p>
          <p className="text-2xl font-bold text-green-600 mt-1">$1,245.50</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Transactions</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">45</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Average Sale</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">$27.68</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Returns</p>
          <p className="text-2xl font-bold text-red-600 mt-1">3</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales by Hour</h2>
        <div className="space-y-3">
          {[...Array(10)].map((_, i) => {
            const hour = 9 + i;
            const sales = Math.floor(Math.random() * 200 + 50);
            return (
              <div key={i} className="flex items-center">
                <span className="text-sm text-gray-600 w-20">{hour}:00</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 h-4 rounded-full"
                      style={{ width: `${(sales / 250) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-semibold w-16 text-right">${sales}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DailySales;
