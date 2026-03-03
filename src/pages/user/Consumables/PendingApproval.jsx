import { useState, useEffect } from "react";
import { getAllProductions, approveProduction, rejectProduction } from "../../../utils/storekeeper.utils";

const PendingApprovals = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduction, setSelectedProduction] = useState(null);
  const [note, setNote] = useState("");
  const [actionType, setActionType] = useState(null); // "approve" or "reject"

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const data = await getAllProductions();
        setApprovals((data.data || []).filter((prod) => prod.status === "PENDING"));
      } catch (error) {
        console.error("Error fetching approvals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, []);

  const handleConfirm = async () => {
    if (!selectedProduction || !actionType) return;
    try {
      let response;
      if (actionType === "approve") {
        response = await approveProduction(selectedProduction.id, note);
      } else {
        response = await rejectProduction(selectedProduction.id, note);
      }

      if (response.success) {
        alert(`Production ${actionType}d successfully!`);
        setApprovals((prev) =>
          prev.filter((prod) => prod.id !== selectedProduction.id)
        );
        setSelectedProduction(null);
        setNote("");
        setActionType(null);
      } else {
        alert(`Failed to ${actionType} production`);
      }
    } catch (error) {
      console.error(`Error ${actionType}ing production:`, error);
      alert(`Error ${actionType}ing production`);
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Pending Approvals</h3>

      {loading ? (
        <p className="text-gray-500">Loading pending approvals...</p>
      ) : approvals.length === 0 ? (
        <p className="text-gray-500">No pending approvals found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvals.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-2">
                  Batch-{prod.id}
                </h2>
                <p className="text-sm text-gray-600 mb-2">
                  Date: {new Date(prod.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Items:
                  <br />
                  {prod.items
                    ?.map((item) => `${item.product?.name} (${item.quantity}) x`)
                    .join(", ") || "—"}
                </p>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setSelectedProduction(prod);
                    setActionType("approve");
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    setSelectedProduction(prod);
                    setActionType("reject");
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedProduction && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              {actionType === "approve"
                ? `Approve Batch-${selectedProduction.id}`
                : `Reject Batch-${selectedProduction.id}`}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Please enter a {actionType} note before confirming.
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full text-gray-700 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none mb-4"
              rows="4"
              placeholder={`Type in the ${actionType} note...`}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedProduction(null);
                  setNote("");
                  setActionType(null);
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 ${
                  actionType === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                } text-white text-sm font-medium rounded-lg`}
              >
                {actionType === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
            <button
              onClick={() => {
                setSelectedProduction(null);
                setNote("");
                setActionType(null);
              }}
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

export default PendingApprovals;