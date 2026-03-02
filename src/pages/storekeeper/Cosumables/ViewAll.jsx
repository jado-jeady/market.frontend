import { useState, useEffect } from "react";
import { getAllProductions } from "../../../utils/storekeeper.utils";

const ViewAll = () => {
  const [productions, setProductions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedProduction, setSelectedProduction] = useState(null);

useEffect(() => {
  const fetchProductions = async () => {
    try {
      const data = await getAllProductions();
      console.log("Productions:", data);

      setProductions(data.data || []); // backend should return { data: [...] }
    } catch (error) {
      console.error("Error fetching productions:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchProductions();
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

  const filteredProductions =
    filter === "all"
      ? productions
      : productions.filter(
          (prod) => prod.status?.toLowerCase() === filter.toLowerCase()
        );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Productions</h1>
          <p className="text-gray-600 mt-1">View all production records</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 text-gray-700 focus:ring-orange-500 outline-none"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md text-gray-700 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Batch ID</th>
              <th className="px-6 py-3 text-left font-semibold">Items</th>
              <th className="px-6 py-3 text-left font-semibold">Total Quantity</th>
              <th className="px-6 py-3 text-left font-semibold">Date Added</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
              <th className="px-6 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          {/* Table body */}
<tbody className="divide-y divide-gray-200">
  {loading ? (
    <tr>
      <td colSpan="6" className="text-center py-6 text-gray-500">
        Loading productions...
      </td>
    </tr>
  ) : filteredProductions.length === 0 ? (
    <tr>
      <td colSpan="6" className="text-center py-6 text-gray-500">
        No productions found
      </td>
    </tr>
  ) : (
    filteredProductions.map((prod) => (
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
          {new Date(prod.createdAt).toLocaleString()}
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
        <td className="px-6 py-4">
          <button
            onClick={() => setSelectedProduction(prod)}
            className="text-orange-600 hover:text-orange-700 font-medium text-sm"
          >
            View Details
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedProduction && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              Production Details (Batch-{selectedProduction.id})
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Status:{" "}
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  selectedProduction.status
                )}`}
              >
                {selectedProduction.status}
              </span>
            </p>

            <table className="w-full text-gray-700 text-sm mb-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Item</th>
                  <th className="px-4 py-2 text-center">Quantity</th>
                  <th className="px-4 py-2 text-center">Production Time</th>
                  <th className="px-4 py-2 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
  {selectedProduction.items?.map((item, idx) => (
    <tr key={idx} className="border-t ">
      <td className="px-4 py-2">{item.product?.name}</td>
      <td className="px-4 py-2 text-center">{item.quantity}</td>
      <td className="px-4 py-2 text-center">
        {item.production_time || "—"}
      </td>
      <td className="px-4 py-2">{item.notes || "—"}</td>
    </tr>
  ))}
</tbody>

            </table>

            <button
              onClick={() => setSelectedProduction(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAll;