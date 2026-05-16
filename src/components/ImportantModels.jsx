// ImportantModels.jsx
import React from "react";

export default function DisplayDamages({ report, onClose }) {
  if (!report) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[750px] max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-5 py-3">
          <h2 className="text-lg font-bold text-slate-700">
            Report #{report.ref_number}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            ✖
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 text-sm text-slate-700">
          <div className="grid grid-cols-3 gap-x-8 gap-y-2">
            <p>
              <strong>Item:</strong> {report.product?.name ?? "—"}
            </p>
            <p>
              <strong>Barcode:</strong> {report.product?.barcode ?? "—"}
            </p>

            <p>
              <strong>Damage Type:</strong> {report.damage_type}
            </p>
            <p>
              <strong>Severity:</strong> {report.severity}
            </p>

            <p>
              <strong>Description:</strong> {report.description}
            </p>
            <p>
              <strong>Estimated Cost:</strong> ${report.estimated_cost}
            </p>

            <p>
              <strong>Location:</strong> {report.location}
            </p>
            <p>
              <strong>Witnesses:</strong> {report.witnesses}
            </p>

            <p>
              <strong>Reported By (User ID):</strong> {report.reported_by}
            </p>
            <p>
              <strong>Status:</strong> {report.status}
            </p>

            <p>
              <strong>Incident Date:</strong> {report.incident_date}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(report.createdAt).toLocaleString()}
            </p>

            <p>
              <strong>Updated At:</strong>{" "}
              {new Date(report.updatedAt).toLocaleString()}
            </p>
          </div>

          {/* Photos */}
          <div className="mt-6">
            <strong>Photos:</strong>
            <div className="flex gap-3 mt-2 flex-wrap">
              {report.image_1_url && (
                <img
                  src={report.image_1_url}
                  alt="Damage 1"
                  className="w-28 h-28 object-cover rounded-md border"
                />
              )}
              {report.image_2_url && (
                <img
                  src={report.image_2_url}
                  alt="Damage 2"
                  className="w-28 h-28 object-cover rounded-md border"
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-5 py-3 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700"
          >
            Close
          </button>
          <button
            onClick={() => console.log("Approve", report.id)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Approve
          </button>
          <button
            onClick={() => console.log("Reject", report.id)}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
