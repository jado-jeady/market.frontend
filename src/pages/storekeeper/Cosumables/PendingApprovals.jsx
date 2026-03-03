import { useState, useEffect } from "react";
import { getAllProductions, abortProduction } from "../../../utils/storekeeper.utils";

const PendingApprovals = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const data = await getAllProductions();
        setPending((data.data || []).filter((prod) => prod.status === "PENDING"));
      } catch (error) {
        console.error("Error fetching pending approvals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  const handleAbort = async (id) => {
    if (!window.confirm("Are you sure you want to abort this batch? This action cannot be undone.")) return;
    try {
      const response = await abortProduction(id);
      if (response.success) {
        alert("Production batch aborted successfully!");
        setPending((prev) => prev.filter((prod) => prod.id !== id));
      } else {
        alert(response.message || "Failed to abort batch");
      }
    } catch (error) {
      console.error("Error aborting batch:", error);
      alert("Error aborting batch");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pending Approvals</h1>

      {loading ? (
        <p className="text-gray-500">Loading pending approvals...</p>
      ) : pending.length === 0 ? (
        <p className="text-gray-500">No pending approvals found</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md text-gray-700 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Batch ID</th>
                <th className="px-6 py-3 text-left font-semibold">Items</th>
                <th className="px-6 py-3 text-left font-semibold">Total Quantity</th>
                <th className="px-6 py-3 text-left font-semibold">Date Added</th>
                <th className="px-6 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pending.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">BATCH-{prod.id}</td>
                  <td className="px-6 py-4">
                    {prod.items
                      ?.map((item) => `${item.product?.name} (${item.quantity})`)
                      .join(", ") || "—"}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {prod.items?.reduce(
                      (sum, item) => sum + Number(item.quantity || 0),
                      0
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {prod.created_at
                      ? new Date(prod.created_at).toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleAbort(prod.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg"
                    >
                      Abort
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;