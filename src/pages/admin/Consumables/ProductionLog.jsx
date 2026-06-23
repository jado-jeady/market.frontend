import React, { useState } from "react";

const ProductionLog = () => {
  // Mock data for pending requests
  const pendingRequests = [
    {
      id: 1,
      user: "John Doe",
      item: "Sambusa",
      quantity: 50,
      status: "Pending",
      date: "2026-06-23",
    },
    {
      id: 2,
      user: "Jane Smith",
      item: "Breads",
      quantity: 10,
      status: "Pending",
      date: "2026-06-23",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* --- Header & Stats --- */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Admin Command Center
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <StatCard
            title="Pending Approvals"
            value="12"
            color="text-amber-600"
          />
          <StatCard
            title="Today's Total Spend"
            value="RWF 45,000"
            color="text-orange-600"
          />
          <StatCard
            title="Active Consumables"
            value="5"
            color="text-green-600"
          />
        </div>
      </div>

      {/* --- Pending Approvals Table --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4">Pending Approvals</h2>
        <table className="w-full text-left">
          <thead className="border-b border-gray-200">
            <tr className="text-gray-400 text-sm uppercase">
              <th className="pb-3">Requester</th>
              <th className="pb-3">Item</th>
              <th className="pb-3">Qty</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pendingRequests.map((req) => (
              <tr key={req.id} className="text-gray-700">
                <td className="py-4">{req.user}</td>
                <td className="py-4 font-medium">{req.item}</td>
                <td className="py-4">{req.quantity}</td>
                <td className="py-4">{req.date}</td>
                <td className="py-4 flex space-x-2">
                  <button className="px-3 py-1 bg-green-50 text-green-600 rounded text-xs font-bold hover:bg-green-100">
                    Approve
                  </button>
                  <button className="px-3 py-1 bg-red-50 text-red-600 rounded text-xs font-bold hover:bg-red-100">
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <p className="text-sm text-gray-500">{title}</p>
    <p className={`text-2xl font-black mt-1 ${color}`}>{value}</p>
  </div>
);

export default ProductionLog;
