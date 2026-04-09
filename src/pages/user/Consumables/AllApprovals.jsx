import { useState, useEffect } from "react";
import {
  getAllProductions,
  approveProduction,
  rejectProduction,
} from "../../../utils/storekeeper.utils";
import { toast } from "react-toastify";

const AllApprovals = () => {
  const [approvals, setApprovals] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedProduction, setSelectedProduction] = useState(null);
  const [actionType, setActionType] = useState(null); // "approve" or "reject"
  const [note, setNote] = useState("");
  const limit = 10;
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const data = await getAllProductions(page, limit);
        setApprovals(data.data || []);
        setTotal(data.total || 0);
      } catch (error) {
        console.error("Error fetching approvals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApprovals();
  }, [page]);

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

  const handleConfirm = async () => {
    if (!selectedProduction || !actionType) return;

    setActionLoading(true);

    let response;
    try {
      if (actionType === "approve") {
        response = await approveProduction(selectedProduction.id, note);
      } else {
        response = await rejectProduction(selectedProduction.id, note);
      }

      if (response.success) {
        toast.success(`Production ${actionType}d successfully!`);
        setApprovals((prev) =>
          prev.map((prod) =>
            prod.id === selectedProduction.id
              ? {
                  ...prod,
                  status: actionType.toUpperCase(),
                  approval_note:
                    actionType === "approve" ? note : prod.approval_note,
                  rejection_reason:
                    actionType === "reject" ? note : prod.rejection_reason,
                }
              : prod,
          ),
        );
        setSelectedProduction(null);
        setNote("");
        setActionType(null);
      } else {
        toast.error(`Failed to ${actionType} production`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredApprovals =
    filter === "all"
      ? approvals
      : approvals.filter(
          (prod) => prod.status?.toLowerCase() === filter.toLowerCase(),
        );

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">All Approvals</h3>
          <p className="text-gray-600 text-xs mt-1">
            View and manage production approvals
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
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
              <th className="px-6 py-3 text-left font-semibold">
                Total Quantity
              </th>
              <th className="px-6 py-3 text-left font-semibold">Time Added</th>
              <th className="px-6 py-3 text-left font-semibold">
                Approved/Rejected By
              </th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
              <th className="px-6 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  Loading approvals...
                </td>
              </tr>
            ) : filteredApprovals.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No approvals found
                </td>
              </tr>
            ) : (
              filteredApprovals.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">BATCH-{prod.id}</td>
                  <td className="px-6 py-4">
                    {prod.items
                      ?.map(
                        (item) => `${item.product?.name} (${item.quantity})`,
                      )
                      .join(", ") || "—"}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {prod.items?.reduce(
                      (sum, item) => sum + Number(item.quantity || 0),
                      0,
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {prod.created_at
                      ? new Date(prod.created_at).toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    {prod.approvedBy?.full_name ||
                      prod.rejectedBy?.full_name ||
                      "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        prod.status,
                      )}`}
                    >
                      {prod.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {prod.status === "PENDING" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedProduction(prod);
                            setActionType("approve");
                          }}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduction(prod);
                            setActionType("reject");
                          }}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg"
                        >
                          Reject
                        </button>
                      </div>
                    ) : prod.status === "APPROVED" ? (
                      <button
                        onClick={() => {
                          setSelectedProduction(prod);
                          setActionType("approve");
                        }}
                        className="text-green-600 text-xs hover:underline"
                      >
                        View Approval Info
                      </button>
                    ) : prod.status === "REJECTED" ? (
                      <button
                        onClick={() => {
                          setSelectedProduction(prod);
                          setActionType("reject");
                        }}
                        className="text-red-600 text-xs hover:underline"
                      >
                        View Rejection Info
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center text-gray-600 gap-4 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {/* Modal for Approve/Reject Info */}
      {selectedProduction && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              {actionType === "approve"
                ? `Approve Batch-${selectedProduction.id}`
                : actionType === "reject"
                  ? `Reject Batch-${selectedProduction.id}`
                  : selectedProduction.status === "APPROVED"
                    ? `Approval Details (Batch-${selectedProduction.id})`
                    : `Rejection Details (Batch-${selectedProduction.id})`}
            </h2>

            {/* If pending and user clicked Approve/Reject, show textarea */}
            {selectedProduction.status === "PENDING" && actionType && (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Please enter a {actionType} note before confirming.
                </p>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border  text-gray-700 border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none mb-4"
                  rows="4"
                  placeholder={`${actionType} note...`}
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
                    disabled={actionLoading}
                    className={`px-4 py-2 ${
                      actionType === "approve"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    } text-white text-sm font-medium rounded-lg disabled:opacity-50`}
                  >
                    {actionLoading
                      ? actionType === "approve"
                        ? "Approving..."
                        : "Rejecting..."
                      : actionType === "approve"
                        ? "Approve"
                        : "Reject"}
                  </button>
                </div>
              </>
            )}

            {/* If already approved/rejected, show info */}
            {selectedProduction.status === "APPROVED" && (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Note:{" "}
                  <span className="text-green-600 font-medium">
                    {selectedProduction.approval_note || "No note provided"}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Approved By: {selectedProduction.approvedBy?.full_name || "—"}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Date:{" "}
                  {selectedProduction.approved_at
                    ? new Date(selectedProduction.approved_at).toLocaleString()
                    : "—"}
                </p>
              </>
            )}

            {selectedProduction.status === "REJECTED" && (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Reason:{" "}
                  <span className="text-red-600 font-medium">
                    {selectedProduction.rejection_reason ||
                      "No reason provided"}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Rejected By: {selectedProduction.rejectedBy?.full_name || "—"}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Date & Time of Approval:{" "}
                  {selectedProduction.rejected_at
                    ? new Date(selectedProduction.rejected_at).toLocaleString()
                    : "—"}
                </p>
              </>
            )}

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

export default AllApprovals;
