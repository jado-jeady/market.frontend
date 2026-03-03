import { useState, useEffect } from "react";
import { getAllProductions } from "../../../utils/storekeeper.utils";

const Approved = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const data = await getAllProductions();
        // Only approved productions
        setApprovals((data.data || []).filter((prod) => prod.status === "APPROVED"));
      } catch (error) {
        console.error("Error fetching approvals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">All Approved Productions</h3>

      <div className="bg-white rounded-lg shadow-md text-gray-700 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Batch ID</th>
              <th className="px-6 py-3 text-left font-semibold">Items</th>
              <th className="px-6 py-3 text-left font-semibold">Total Quantity</th>
              <th className="px-6 py-3 text-left font-semibold">Date Approved</th>
              <th className="px-6 py-3 text-left font-semibold">Approved By</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Loading approved productions...
                </td>
              </tr>
            ) : approvals.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No approved productions found
                </td>
              </tr>
            ) : (
              approvals.map((prod) => (
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
                    {prod.approved_at
                      ? new Date(prod.approved_at).toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    {prod.approvedBy?.full_name || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        prod.status
                      )}`}
                    >
                      {prod.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Approved;