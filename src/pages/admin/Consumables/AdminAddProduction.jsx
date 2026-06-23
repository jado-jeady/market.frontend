import React, { useState } from "react";

const AdminAddProduction = () => {
  // Mock data representing incoming production batches
  const [pendingBatches, setPendingBatches] = useState([
    {
      id: 101,
      staff: "Storekeeper A",
      time: "14:30:05",
      items: [
        { name: "Sambusa", qty: 100 },
        { name: "Mandazi", qty: 200 },
      ],
      totalItems: 300,
    },
  ]);

  const handleApprove = (id) => {
    // API Call to confirm production and move to inventory
    console.log(`Approving batch ${id}`);
    setPendingBatches(pendingBatches.filter((b) => b.id !== id));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Production Adding</h1>
        <p className="text-gray-600">
          Review and authorize daily production logs
        </p>
      </div>

      <div className="grid gap-6">
        {pendingBatches.length > 0 ? (
          pendingBatches.map((batch) => (
            <div
              key={batch.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="bg-gray-50 px-6 py-3 border-b flex justify-between items-center">
                <span className="font-semibold text-gray-700">
                  Batch ID: #{batch.id}
                </span>
                <span className="text-xs text-gray-500">
                  Submitted at: {batch.time}
                </span>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500">
                    Submitted by:{" "}
                    <span className="font-medium text-gray-900">
                      {batch.staff}
                    </span>
                  </p>
                </div>

                <div className="space-y-2 mb-6">
                  {batch.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between bg-gray-50 p-2 rounded text-sm"
                    >
                      <span>{item.name}</span>
                      <span className="font-bold">{item.qty} units</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(batch.id)}
                    className="flex-1 bg-orange-600 text-white py-2 rounded-lg font-medium hover:bg-orange-700 transition"
                  >
                    Confirm & Update Inventory
                  </button>
                  <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed">
            <p className="text-gray-400">
              All production batches have been reviewed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAddProduction;
