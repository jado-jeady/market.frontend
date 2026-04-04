import { useState, useEffect } from "react";
import {
  getAllReturns,
  approveReturn,
  rejectReturn,
} from "../../../utils/sales.util";
import { toast } from "react-toastify";
import { Search, Filter, Loader2, Check, X } from "lucide-react";

const SalesClaim = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null); // Tracks which ID is being updated
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const authData = JSON.parse(localStorage.getItem("user"));
  const userId = authData?.data?.user?.id;

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await getAllReturns();
      setClaims(res || []);
    } catch (err) {
      toast.error("Failed to load claims");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleApprove = async (return_id, approved_by) => {
    setProcessingId(return_id);
    try {
      await approveReturn(return_id, approved_by);
      toast.success("Return approved");
      await fetchClaims();
    } catch {
      toast.error("Failed to approve return");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    setProcessingId(id);
    try {
      await rejectReturn(id);
      toast.success("Return rejected");
      await fetchClaims();
    } catch {
      toast.error("Failed to reject return");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredClaims = claims.filter((claim) => {
    const matchesInvoice = claim.Sale?.invoice_number
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = statusFilter === "" || claim.status === statusFilter;
    return matchesInvoice && matchesStatus;
  });

  return (
    <div className="p-4 md:p-6 text-gray-600 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800">Sales Return Claims</h3>
        <p className="text-xs text-gray-500 font-medium">
          Manage and process product returns
        </p>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-3 rounded-xl shadow-sm mb-6 grid grid-cols-1 md:grid-cols-3 gap-3 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice..."
            className="w-full pl-9 h-9 text-xs border rounded-lg bg-gray-50 outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 text-xs border rounded-lg bg-gray-50 px-3 outline-none"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <button
          onClick={() => {
            setSearch("");
            setStatusFilter("");
          }}
          className="text-xs font-bold text-green-600"
        >
          RESET
        </button>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <th className="px-6 py-4">Invoice</th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4 text-center">Qty</th>
              <th className="px-6 py-4">Reason</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-20">
                  <div className="flex justify-center items-center gap-3">
                    <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
                    <span className="text-xs text-gray-400 font-medium tracking-wide">
                      Fetching returns...
                    </span>
                  </div>
                </td>
              </tr>
            ) : filteredClaims.length > 0 ? (
              filteredClaims.map((claim) => (
                <tr
                  key={claim.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">
                    {claim.Sale?.invoice_number}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {claim?.SaleItem?.Product?.name}
                  </td>
                  <td className="px-6 py-4 text-xs text-center">
                    {claim.quantity}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 italic">
                    "{claim.reason || "-"}"
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] font-black px-2 py-1 rounded-full ${
                        claim.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : claim.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {claim.status === "PENDING" && (
                      <div className="flex justify-end gap-4">
                        <button
                          disabled={processingId === claim.id}
                          onClick={() => handleApprove(claim.id, userId)}
                          className="text-green-600 hover:text-green-800 text-xs font-bold disabled:opacity-50"
                        >
                          {processingId === claim.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Confirm"
                          )}
                        </button>
                        <button
                          disabled={processingId === claim.id}
                          onClick={() => handleReject(claim.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold disabled:opacity-50"
                        >
                          {processingId === claim.id ? "..." : "Reject"}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="py-10 text-center text-gray-400 text-sm italic"
                >
                  No return claims found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE GRID */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          </div>
        ) : (
          filteredClaims.map((claim) => (
            <div
              key={claim.id}
              className="p-4 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-sm font-bold text-gray-800">
                  {claim.Sale?.invoice_number}
                </h4>
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    claim.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {claim.status}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-4">
                {claim?.SaleItem?.Product?.name} (Qty: {claim.quantity})
              </p>
              {claim.status === "PENDING" && (
                <div className="flex gap-2">
                  <button
                    disabled={processingId === claim.id}
                    onClick={() => handleApprove(claim.id, userId)}
                    className="flex-1 bg-green-600 text-white text-xs py-2 rounded-lg font-bold flex justify-center items-center"
                  >
                    {processingId === claim.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Confirm"
                    )}
                  </button>
                  <button
                    disabled={processingId === claim.id}
                    onClick={() => handleReject(claim.id)}
                    className="flex-1 bg-red-50 text-red-500 text-xs py-2 rounded-lg font-bold"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SalesClaim;
