import { useState } from "react";
import { toast } from "react-toastify";
import { receiveStock, adjustStock } from "../../../utils/product.util";
import { Package, Wrench } from "lucide-react";

const StockAdjustmentModal = ({ isOpen, onClose, product, refresh }) => {
  // "arrival" = new batch | "adjust" = manual IN/OUT
  const [mode, setMode] = useState("arrival");

  // Arrival fields
  const [arrivalQty, setArrivalQty] = useState("");
  const [arrivalBuying, setArrivalBuying] = useState(
    product?.buying_price ?? "",
  );
  const [arrivalSelling, setArrivalSelling] = useState(
    product?.selling_price ?? "",
  );
  const [arrivalExpiry, setArrivalExpiry] = useState("");
  const [arrivalReason, setArrivalReason] = useState("");

  // Manual adjustment fields
  const [adjType, setAdjType] = useState("IN");
  const [adjQty, setAdjQty] = useState("");
  const [adjReason, setAdjReason] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !product) return null;

  const resetAll = () => {
    setMode("arrival");
    setArrivalQty("");
    setArrivalBuying(product?.buying_price ?? "");
    setArrivalSelling(product?.selling_price ?? "");
    setArrivalExpiry("");
    setArrivalReason("");
    setAdjType("IN");
    setAdjQty("");
    setAdjReason("");
    setError("");
    setLoading(false);
    setSubmitting(false);
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };
  /* ============== SUBMIT: NEW ARRIVAL ============== */
  const handleArrivalSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setError("");

    // Validation (return WITHOUT setting submitting)
    if (!arrivalQty || Number(arrivalQty) <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }
    if (!arrivalBuying || Number(arrivalBuying) < 0) {
      setError("Buying price is required");
      return;
    }
    if (!arrivalSelling || Number(arrivalSelling) <= 0) {
      setError("Selling price is required");
      return;
    }
    if (Number(arrivalSelling) < Number(arrivalBuying)) {
      toast.warn(
        "Selling price is lower than buying price — you'll sell at a loss",
      );
    }

    // NOW set the flags — after validation passes
    setSubmitting(true);
    setLoading(true);

    try {
      const res = await receiveStock({
        product_id: product.id,
        quantity: Number(arrivalQty),
        buying_price: Number(arrivalBuying),
        selling_price: Number(arrivalSelling),
        expire_date: arrivalExpiry || null,
        change_reason:
          arrivalReason || `New stock received for ${product.name}`,
        update_existing_batches: true,
      });

      if (!res?.success) {
        // ← FIX: use .success not .ok
        setError(res?.message || "Failed to receive stock");
        return;
      }

      toast.success(
        res.data?.synced_batches?.length
          ? `Stock received. ${res.data.synced_batches.length} shelf price(s) synced.`
          : "New stock received successfully",
      );

      refresh();
      handleClose();
    } catch (err) {
      setError(err.message || "Error receiving stock");
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  /* ============== SUBMIT: MANUAL ADJUSTMENT ============== */
  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setError("");

    // Validation
    if (!adjQty || Number(adjQty) <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }
    if (adjType === "OUT" && Number(adjQty) > product.stock_quantity) {
      setError("You can't remove more stock than you have");
      return;
    }
    if (!adjReason.trim()) {
      setError("Reason is required for manual adjustments");
      return;
    }

    setSubmitting(true);
    setLoading(true);

    try {
      const res = await adjustStock({
        product_id: product.id,
        barcode: product.barcode,
        type: adjType,
        quantity: Number(adjQty),
        reason: adjReason,
      });

      if (!res?.success) {
        // ← FIX
        setError(res?.message || "Failed to adjust stock");
        return;
      }

      toast.success("Stock adjusted successfully");
      refresh();
      handleClose();
    } catch (err) {
      setError(err.message || "Error adjusting stock");
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center p-3">
      <div className="bg-white w-full max-w-[520px] rounded-2xl shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="bg-gray-900 text-white px-5 py-4">
          <h2 className="text-lg font-bold truncate">Stock — {product.name}</h2>
          <div className="flex justify-between text-[11px] mt-1 text-gray-300">
            <span>
              Current Stock:{" "}
              <strong className="text-white">{product.stock_quantity}</strong>
            </span>
            <span>
              Barcode: <strong className="text-white">{product.barcode}</strong>
            </span>
          </div>
        </div>

        {/* MODE TABS */}
        <div className="flex border-b bg-gray-50">
          <button
            type="button"
            onClick={() => {
              setMode("arrival");
              setError("");
            }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              mode === "arrival"
                ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Package className="w-4 h-4" /> New Arrival
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("adjust");
              setError("");
            }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              mode === "adjust"
                ? "text-orange-600 border-b-2 border-orange-600 bg-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Wrench className="w-4 h-4" /> Manual Adjust
          </button>
        </div>

        {/* FORM BODY */}
        <div className="p-5 text-gray-700">
          {mode === "arrival" ? (
            <form onSubmit={handleArrivalSubmit} className="space-y-3">
              <p className="text-[11px] text-gray-500 -mt-1 mb-2">
                Use this when new stock physically arrives. A new batch is
                created — existing stock keeps its own buying price.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">
                    Quantity Received *
                  </label>
                  <input
                    type="number"
                    disabled={loading}
                    min="1"
                    value={arrivalQty}
                    onChange={(e) => setArrivalQty(e.target.value)}
                    placeholder="e.g. 24"
                    className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">
                    Buying Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    disabled={loading}
                    min="0"
                    value={arrivalBuying}
                    onChange={(e) => setArrivalBuying(e.target.value)}
                    className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">
                    Selling Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    disabled={loading}
                    value={arrivalSelling}
                    onChange={(e) => setArrivalSelling(e.target.value)}
                    className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">
                    Expiry Date (optional)
                  </label>
                  <input
                    type="date"
                    value={arrivalExpiry}
                    disabled={loading}
                    onChange={(e) => setArrivalExpiry(e.target.value)}
                    className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">
                    Note (optional)
                  </label>
                  <input
                    type="text"
                    value={arrivalReason}
                    disabled={loading}
                    onChange={(e) => setArrivalReason(e.target.value)}
                    placeholder="e.g. Supplier delivery - Inyange"
                    className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {Number(arrivalSelling) !== Number(product.selling_price) &&
                arrivalSelling !== "" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-[11px] text-amber-800">
                    ⚠️ Selling price will change from{" "}
                    <strong>
                      {Number(product.selling_price).toLocaleString()}
                    </strong>{" "}
                    to{" "}
                    <strong>{Number(arrivalSelling).toLocaleString()}</strong>.
                    All other active batches will be synced to this price.
                  </div>
                )}

              {error && (
                <p className="text-xs text-red-600 font-semibold">{error}</p>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Receive Stock"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAdjustSubmit} className="space-y-3">
              <p className="text-[11px] text-gray-500 -mt-1 mb-2">
                Use this to correct stock without new pricing — damages, losses,
                or physical count corrections.
              </p>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">
                  Adjustment Type *
                </label>
                <select
                  value={adjType}
                  onChange={(e) => setAdjType(e.target.value)}
                  className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                >
                  <option value="IN">Stock In (found, returned)</option>
                  <option value="OUT">Stock Out (damaged, lost)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  value={adjQty}
                  onChange={(e) => setAdjQty(e.target.value)}
                  className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">
                  Reason *
                </label>
                <input
                  type="text"
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  placeholder="e.g. Physical count correction"
                  className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  required
                />
              </div>

              {error && (
                <p className="text-xs text-red-600 font-semibold">{error}</p>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                >
                  {loading ? "Adjusting..." : "Adjust Stock"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockAdjustmentModal;
