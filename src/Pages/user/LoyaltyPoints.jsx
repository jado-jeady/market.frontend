import { Link } from "react-router-dom";

const LoyaltyPoints = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Loyalty Points</h1>
        <p className="text-blue-600 mt-1">Manage customer loyalty rewards</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-primary-600 to-secondary-600 text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Points</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Tier</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[...Array(8)].map((_, i) => {
              const points = Math.floor(Math.random() * 1000);
              const tier = points > 500 ? 'Gold' : points > 200 ? 'Silver' : 'Bronze';
              const tierColor = points > 500 ? 'bg-yellow-100 text-yellow-700' : points > 200 ? 'bg-gray-100 text-gray-700' : 'bg-orange-100 text-orange-700';
              
              return (
                <tr key={i} className="hover:bg-gray-50 text-gray-500 text-xs ">
                  <td className="px-6 py-4 text-xs font-medium">Customer {i + 1}</td>
                  <td className="px-6 py-4 text-xs">+1 555-000-{String(i).padStart(4, '0')}</td>
                  <td className="px-6 py-4 text-xs font-bold text-blue-600">{points}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${tierColor}`}>
                      {tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Link to="/user/customers/loyalty/add-points" className="text-blue-600 hover:text-primary-700 font-medium mr-3">
                      Add Points
                    </Link>
                    <Link to="/user/customers/loyalty/redeem" className="text-secondary-600 hover:text-secondary-700 font-medium">
                      Redeem
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoyaltyPoints;
