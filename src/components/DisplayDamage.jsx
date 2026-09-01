// components/DisplayDamages.jsx
import React, { useState } from "react";
import { X, CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react";
import { updateReportStatus } from "../utils/damage.util";

export default function DisplayDamages({ report, onClose, onStatusUpdate }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  if (!report) return null;

  const handleStatusUpdate = async (newStatus) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await updateReportStatus(report.id, newStatus);
      setSuccess(`Report ${newStatus.toLowerCase()} successfully!`);

      // Update the report in the parent component
      if (onStatusUpdate) {
        onStatusUpdate(report.id, newStatus);
      }

      // Close modal after success
      setTimeout(() => {
        if (onClose) onClose();
      }, 500);
    } catch (err) {
      setError(err.message || `Failed to ${newStatus.toLowerCase()} report`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      "In Review": "bg-blue-100 text-blue-800 border-blue-200",
      Resolved: "bg-green-100 text-green-800 border-green-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getSeverityColor = (severity) => {
    const colors = {
      Minor: "bg-green-100 text-green-800 border-green-200",
      Moderate: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Severe: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[severity] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm font-mono">
                #{report.ref_number}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.status)}`}
              >
                {report.status}
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Reported on {formatDate(report.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Success/Error Messages */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700 text-sm">
              <CheckCircle className="w-4 h-4" />
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Item Information
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {report.product?.name || "—"}
                </p>
                <p className="text-xs text-gray-500 font-mono">
                  {report.product?.barcode || "—"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Damage Details
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="px-2.5 py-1 bg-gray-200 rounded-lg text-xs font-semibold text-gray-700">
                    {report.damage_type}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${getSeverityColor(report.severity)}`}
                  >
                    {report.severity}
                  </span>
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
                    Qty: {report.quantity || 1}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {report.description}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Location & Details
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  {report.location || "—"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Witnesses: {report.witnesses || "—"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Cost Information
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  Estimated Cost:{" "}
                  {report.estimated_cost ? `$${report.estimated_cost}` : "—"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Incident Date: {report.incident_date || "—"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Reporter
                </p>
                <p className="text-sm text-gray-700">
                  ID: {report.reported_by || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Photos */}
          {(report.image_1_url || report.image_2_url) && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">
                Photos
              </p>
              <div className="flex gap-3 flex-wrap">
                {report.image_1_url && (
                  <img
                    src={report.image_1_url}
                    alt="Damage 1"
                    className="w-32 h-32 object-cover rounded-xl border border-gray-200 hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => window.open(report.image_1_url, "_blank")}
                  />
                )}
                {report.image_2_url && (
                  <img
                    src={report.image_2_url}
                    alt="Damage 2"
                    className="w-32 h-32 object-cover rounded-xl border border-gray-200 hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => window.open(report.image_2_url, "_blank")}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl flex flex-wrap gap-3 justify-end">
          {report.status !== "Resolved" && (
            <button
              onClick={() => handleStatusUpdate("Resolved")}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-200"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              Approve & Resolve
            </button>
          )}

          {report.status !== "Rejected" && (
            <button
              onClick={() => handleStatusUpdate("Rejected")}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-200"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              Reject
            </button>
          )}

          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all disabled:opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
