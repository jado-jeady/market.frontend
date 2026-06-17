import React, { useState } from "react";
import { Lock } from "lucide-react";

export default function BaristaDayClosing() {
  const [cashExpected] = useState(85000);
  const [cashCounted, setCashCounted] = useState("");

  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col overflow-hidden text-gray-800 text-xs p-3">
      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col h-full overflow-hidden max-w-md mx-auto w-full justify-center">
        <div className="text-center mb-4">
          <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
            <Lock size={18} />
          </div>
          <h2 className="text-base font-black">End of Shift Reconciliation</h2>
          <p className="text-[9px] text-gray-400 uppercase font-semibold tracking-wide">
            Validate drawer drawer balancing declarations
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-3 font-semibold text-[11px]">
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-500">System Calculated Sales</span>
            <span className="text-gray-900 font-black">
              {cashExpected.toLocaleString()} RWF
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] text-gray-400 uppercase font-bold tracking-wide block">
              Actual Cash Tendered in Drawer
            </label>
            <input
              type="number"
              placeholder="Enter physical cash volume..."
              value={cashCounted}
              onChange={(e) => setCashCounted(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white outline-none focus:border-black text-[11px] font-bold"
            />
          </div>

          {cashCounted !== "" && (
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-gray-500">Discrepancy Variance</span>
              <span
                className={`font-black ${Number(cashCounted) - cashExpected === 0 ? "text-green-600" : "text-red-600"}`}
              >
                {(Number(cashCounted) - cashExpected).toLocaleString()} RWF
              </span>
            </div>
          )}
        </div>

        <button className="w-full mt-4 py-2 bg-black text-white font-black rounded-xl hover:bg-gray-800 transition-all active:scale-95 text-center shadow-md">
          Print Z-Report & Lock Terminal
        </button>
      </div>
    </div>
  );
}
