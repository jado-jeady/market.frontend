import { useState, useEffect, useMemo } from "react";
import {
  getAllReturns,
  approveReturn,
  rejectReturn,
} from "../../../utils/sales.util";
import { toast } from "react-toastify";
import {
  Search,
  Loader2,
  Check,
  X,
  RotateCcw,
  Clock,
  User as UserIcon,
  Package,
  MessageSquare,
  Calendar,
} from "lucide-react";

const TABS = [
  { key: "PENDING", label: "Pending", color: "amber" },
  { key: "APPROVED", label: "Approved", color: "emerald" },
  { key: "REJECTED", label: "Rejected", color: "red" },
];

const SalesClaim = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("PENDING");
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const authData = JSON.parse(localStorage.getItem("user"));
  const userId = authData?.data?.user?.id;

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await getAllReturns();
      // Handle both {data} and raw-array responses
      setClaims(Array.isArray(res) ? res : res?.data || []);
      console.log("Claims data:", res?.data || res);
    } catch (err) {
      toast.error("Failed to load claims");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  /* ============ APPROVE ============ */
  const handleApprove = async (returnId) => {
    if (processingId) return;
    setProcessingId(returnId);
    try {
      await approveReturn(returnId, userId);
      toast.success("Return approved");

      // Optimistic update
      setClaims((prev) =>
        prev.map((c) =>
          c.id === returnId
            ? { ...c, status: "APPROVED", approved_by: userId }
            : c,
        ),
      );
      setSelectedClaim(null);
      await fetchClaims();
    } catch (err) {
      toast.error(err?.message || "Failed to approve return");
    } finally {
      setProcessingId(null);
    }
  };

  /* ============ REJECT ============ */
  const openRejectModal = (claimId) => {
    setRejectingId(claimId);
    setRejectionReason("");
  };

  const handleReject = async () => {
    if (!rejectingId) return;
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setProcessingId(rejectingId);
    try {
      await rejectReturn(rejectingId, userId, rejectionReason);
      toast.success("Return rejected");

      setClaims((prev) =>
        prev.map((c) =>
          c.id === rejectingId ? { ...c, status: "REJECTED" } : c,
        ),
      );
      setRejectingId(null);
      setSelectedClaim(null);
      setRejectionReason("");
      await fetchClaims();
    } catch (err) {
      toast.error(err?.message || "Failed to reject return");
    } finally {
      setProcessingId(null);
    }
  };

  /* ============ FILTERS ============ */
  const filtered = useMemo(() => {
    return claims
      .filter((c) => c.status === activeTab)
      .filter((c) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return [
          c.Sale?.invoice_number,
          c.SaleItem?.product_name,
          c.SaleItem?.Product?.name,
          c.reason,
          c.Requester?.full_name,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q);
      });
  }, [claims, activeTab, search]);

  const counts = useMemo(
    () => ({
      PENDING: claims.filter((c) => c.status === "PENDING").length,
      APPROVED: claims.filter((c) => c.status === "APPROVED").length,
      REJECTED: claims.filter((c) => c.status === "REJECTED").length,
    }),
    [claims],
  );

  return (
    <div className="p-3 md:p-6 bg-gray-50 min-h-screen text-gray-700">
      <div className="max-w-full mx-auto">
        {/* HEADER */}
        <div className="mb-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-gray-900 tracking-tight">
              Sales Returns
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Approve or reject product return claims
            </p>
          </div>
          <button
            onClick={fetchClaims}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
          >
            <RotateCcw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* TABS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1 mb-4 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                  activeTab === t.key
                    ? "bg-gray-900 text-white shadow"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {t.label}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                    activeTab === t.key
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {counts[t.key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by invoice, product, requester..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
            <p className="text-xs text-gray-400 uppercase font-black tracking-widest">
              Loading returns...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white p-20 text-center rounded-2xl border border-dashed border-gray-200">
            <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-bold">
              No {activeTab.toLowerCase()} returns
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Everything is up to date
            </p>
          </div>
        ) : (
          /* Changed from flex container to a 2-column grid layout */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filtered.map((claim) => (
              <ClaimRow
                key={claim.id}
                claim={claim}
                processingId={processingId}
                onApprove={() => handleApprove(claim.id)}
                onReject={() => openRejectModal(claim.id)}
                onView={() => setSelectedClaim(claim)}
              />
            ))}
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedClaim && (
        <ClaimDetailModal
          claim={selectedClaim}
          onClose={() => setSelectedClaim(null)}
          onApprove={() => handleApprove(selectedClaim.id)}
          onReject={() => {
            setSelectedClaim(null);
            openRejectModal(selectedClaim.id);
          }}
          processingId={processingId}
        />
      )}

      {/* REJECT REASON MODAL */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3">
              Reason for Rejection
            </h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
              placeholder="e.g., product damaged by customer, outside return window..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setRejectingId(null)}
                className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={processingId === rejectingId}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {processingId === rejectingId
                  ? "Rejecting..."
                  : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============ ROW ============ */
const ClaimRow = ({ claim, processingId, onApprove, onReject, onView }) => {
  const statusStyles = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-100",
    APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    REJECTED: "bg-red-50 text-red-700 border-red-100",
  };
  const isProcessing = processingId === claim.id;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="p-4">
        {/* TOP ROW */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-sm text-gray-900 truncate">
                {claim.SaleItem?.product_name ||
                  claim.SaleItem?.Product?.name ||
                  "Product"}
              </h4>
              <span
                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${statusStyles[claim.status]}`}
              >
                {claim.status}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono mt-0.5">
              {claim.Sale?.invoice_number}
            </p>
          </div>
          <button
            onClick={onView}
            className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-wider"
          >
            Details
          </button>
        </div>

        {/* MID ROW */}
        <div className="grid grid-cols-3 gap-3 py-2 border-t border-b border-gray-50 my-2 text-center">
          <div>
            <p className="text-[9px] text-gray-400 uppercase font-bold">Qty</p>
            <p className="text-sm font-black text-gray-900">{claim.quantity}</p>
          </div>
          <div>
            <p className="text-[9px] text-gray-400 uppercase font-bold">
              Requested By
            </p>
            <p className="text-xs font-bold text-gray-700 truncate">
              {claim.Requester?.full_name || "—"}
            </p>
          </div>
          <div>
            <p className="text-[9px] text-gray-400 uppercase font-bold">Date</p>
            <p className="text-xs font-bold text-gray-700">
              {new Date(claim.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* REASON */}
        {claim.reason && (
          <p className="text-[11px] text-gray-500 italic bg-gray-50 rounded-lg p-2 mb-2">
            "{claim.reason}"
          </p>
        )}

        {/* ACTIONS */}
        {claim.status === "PENDING" && (
          <div className="flex gap-2 pt-2">
            <button
              disabled={isProcessing}
              onClick={onReject}
              className="flex-1 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50"
            >
              Reject
            </button>
            <button
              disabled={isProcessing}
              onClick={onApprove}
              className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 inline-flex items-center justify-center gap-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" /> Approving...
                </>
              ) : (
                <>
                  <Check className="w-3 h-3" /> Approve
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ============ DETAIL MODAL ============ */
const ClaimDetailModal = ({
  claim,
  onClose,
  onApprove,
  onReject,
  processingId,
}) => {
  const isProcessing = processingId === claim.id;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3">
      {/* close button */}

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="bg-gray-900 text-white p-5 rounded-t-2xl">
          <h3 className="text-lg font-black truncate">
            {claim.SaleItem?.product_name || claim.SaleItem?.Product?.name}
          </h3>
          <p className="text-[10px] text-gray-400 font-mono mt-0.5">
            {claim.Sale?.invoice_number}
          </p>
          <button
            onClick={onClose}
            className="absolute top-50 right-180 text-red-400 hover:text-gray-600"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <InfoBlock label="Quantity" value={claim.quantity} />
            <InfoBlock label="Status" value={claim.status} />
            <InfoBlock
              label="Requested By"
              value={claim.Requester?.full_name || "—"}
            />
            <InfoBlock
              label="Date Requested"
              value={new Date(claim.createdAt).toLocaleString()}
            />
            {claim.Sale?.total_amount && (
              <InfoBlock
                label="Sale Total"
                value={`${Number(claim.Sale.total_amount).toLocaleString()} RWF`}
              />
            )}
            {claim.SaleItem?.unit_price && (
              <InfoBlock
                label="Unit Price"
                value={`${Number(claim.SaleItem.unit_price).toLocaleString()} RWF`}
              />
            )}
          </div>

          {claim.reason && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 uppercase font-black mb-1">
                Reason
              </p>
              <p className="text-sm text-gray-700 italic">"{claim.reason}"</p>
            </div>
          )}

          {claim.status === "APPROVED" && claim.Approver && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
              <p className="text-[10px] text-emerald-600 uppercase font-black mb-1">
                Approved By
              </p>
              <p className="text-sm font-bold text-emerald-900">
                {claim.Approver.full_name}
              </p>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        {claim.status === "PENDING" && (
          <div className="p-5 border-t border-gray-100 flex gap-2">
            <button
              onClick={onReject}
              disabled={isProcessing}
              className="flex-1 py-3 text-xs font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 disabled:opacity-50"
            >
              Reject
            </button>
            <button
              onClick={onApprove}
              disabled={isProcessing}
              className="flex-1 py-3 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 disabled:opacity-50 inline-flex items-center justify-center gap-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Approving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" /> Approve Return
                </>
              )}
            </button>
          </div>
        )}

        {claim.status !== "PENDING" && (
          <div className="p-5 border-t border-gray-100">
            <button
              onClick={onClose}
              className="w-full py-3 text-xs font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoBlock = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
    <p className="text-[9px] text-gray-400 uppercase font-black tracking-wider mb-1">
      {label}
    </p>
    <p className="text-sm font-bold text-gray-900 truncate">{value}</p>
  </div>
);

export default SalesClaim;
