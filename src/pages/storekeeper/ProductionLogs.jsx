import { useEffect, useState } from "react";
import { getRecentApprovedProductions } from "../../utils/storekeeper.utils";

const ProductionLog = () => {
  const today = new Date().toLocaleDateString();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduction, setSelectedProduction] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const res = await getRecentApprovedProductions();
      if (res.success) {
        setLogs(res.data);
      }
      setLoading(false);
    };
    fetchLogs();
  }, []);

  return (
    <div className=" min-w-screen p-6">
      <div className="mb-2">
        <h3 className="text-xl font-bold text-gray-900">Production Log</h3>
        <p className="text-gray-600 text-xs mt-1">
          Daily production history and records
        </p>
      </div>

      {/* Today’s Summary */}
      <div className="bg-white rounded-lg shadow-md p-2 mb-6">
        <h3 className="font-semibold  text-xs text-gray-900 mb-4">
          Today's Production Summary - {today}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {logs
            .filter(
              (log) =>
                new Date(log.createdAt).toDateString() ===
                new Date().toDateString()
            )
            .flatMap((log) =>
              log.items.map((item) => (
                <div
                  key={item.id}
                  className="text-center p-2 bg-orange-50 rounded-lg border border-orange-200"
                >
                  <div className="font-semibold text-xs text-gray-900">
                    {item.product?.name}
                  </div>
                  <div className="text-sm font-bold text-orange-600 mt-1">
                    {item.quantity}
                  </div>
                  <div className="text-xs text-gray-500">pieces</div>
                </div>
              ))
            )}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <h3 className="font-semibold">Production History (Last 7 Days)</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-4 text-gray-500">Loading...</p>
          ) : logs.length === 0 ? (
            <p className="p-4 text-gray-500">No approved productions found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {log.items.map((item) => (
                        <div key={item.id}>
                          {item.product?.name} — {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedProduction(log)}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal for viewing production details */}
      {selectedProduction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={() => setSelectedProduction(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Production Batch #{selectedProduction.id}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Approved at:{" "}
              {new Date(selectedProduction.approved_at).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Approval Note: {selectedProduction.approval_note}
            </p>
            <div className="space-y-3">
              {selectedProduction.items.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-3 flex justify-between"
                >
                  <div>
                    <div className="font-semibold">{item.product?.name}</div>
                    <div className="text-xs text-gray-500">
                      Notes: {item.notes || "—"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-orange-600 font-bold">
                      {item.quantity}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.production_time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionLog;