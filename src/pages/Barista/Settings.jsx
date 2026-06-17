import React, { useState } from "react";
import {
  Printer,
  Sliders,
  Smartphone,
  Lock,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

export default function BaristaSettings() {
  // Localized hardware & terminal state parameters
  const [printerIp, setPrinterIp] = useState("192.168.1.10");
  const [printerPort, setPrinterPort] = useState("4000");
  const [taxRate, setTaxRate] = useState("18"); // RRA VAT Standard Default
  const [autoPrint, setAutoPrint] = useState(true);
  const [trainingMode, setTrainingMode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const triggerSaveNotification = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col overflow-hidden text-gray-800 text-xs p-3">
      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col h-full overflow-hidden">
        {/* Top Header Section */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 shrink-0">
          <div>
            <h2 className="text-base font-black">Terminal Configuration</h2>
            <p className="text-[9px] text-gray-400 uppercase font-semibold tracking-wide">
              Manage physical hardware nodes and hardware parameters
            </p>
          </div>
          {saveSuccess && (
            <div className="flex items-center gap-1 bg-green-50 text-green-700 text-[10px] font-bold px-3 py-1.5 rounded-xl border border-green-200 animate-in fade-in slide-in-from-right-2">
              <CheckCircle2 size={12} /> Parameters Synced
            </div>
          )}
        </div>

        {/* Scrollable Layout Form Fields */}
        <form
          onSubmit={triggerSaveNotification}
          className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1 min-h-0"
        >
          {/* Section 1: Network Thermal Printer Configuration */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-1.5">
              <Printer size={13} className="text-gray-400" />
              <h3 className="font-bold text-[10px] text-gray-400 uppercase tracking-widest">
                Hardware Receipt Node
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-semibold text-[11px]">
              <div className="space-y-1">
                <label className="text-[9px] text-gray-400 uppercase font-bold tracking-wide">
                  Network Printer IP Address
                </label>
                <input
                  type="text"
                  value={printerIp}
                  onChange={(e) => setPrinterIp(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-[10px] outline-none focus:border-black bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-gray-400 uppercase font-bold tracking-wide">
                  Target Network Port
                </label>
                <input
                  type="text"
                  value={printerPort}
                  onChange={(e) => setPrinterPort(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-[10px] outline-none focus:border-black bg-white"
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between bg-white border border-gray-200 p-2 rounded-xl">
              <div>
                <span className="font-bold text-gray-900 block text-[11px]">
                  Instant Order Generation
                </span>
                <span className="text-[9px] text-gray-400">
                  Trigger printer ticket on submitting payment transaction
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoPrint}
                onChange={(e) => setAutoPrint(e.target.checked)}
                className="w-4 h-4 accent-black cursor-pointer"
              />
            </div>
          </div>

          {/* Section 2: Regional Accounting & Tax Parameters */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-1.5">
              <Sliders size={13} className="text-gray-400" />
              <h3 className="font-bold text-[10px] text-gray-400 uppercase tracking-widest">
                Operational Computations
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-semibold text-[11px]">
              <div className="space-y-1">
                <label className="text-[9px] text-gray-400 uppercase font-bold tracking-wide">
                  RRA VAT Level Rate (%)
                </label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-[10px] outline-none focus:border-black bg-white font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-gray-400 uppercase font-bold tracking-wide">
                  Terminal Station Alias ID
                </label>
                <input
                  type="text"
                  disabled
                  value="BARISTA-STATION-01"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-[10px] bg-gray-200/60 text-gray-500 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Staff Access PIN Management */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-1.5">
              <Lock size={13} className="text-gray-400" />
              <h3 className="font-bold text-[10px] text-gray-400 uppercase tracking-widest">
                User Session Credentials
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 font-semibold text-[11px]">
              <div className="space-y-1">
                <label className="text-[9px] text-gray-400 uppercase font-bold tracking-wide">
                  Active Pin Sequence
                </label>
                <input
                  type="password"
                  value="••••"
                  readOnly
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-[10px] bg-gray-200/40 text-gray-500 font-bold tracking-widest"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  className="w-full py-1.5 border border-gray-300 hover:border-black rounded-lg bg-white text-gray-700 font-black text-[10px] transition-all active:scale-95"
                >
                  Modify Shift Access PIN
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: System Overrides */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2 border-b border-gray-200 pb-1.5">
              <Smartphone size={13} className="text-gray-400" />
              <h3 className="font-bold text-[10px] text-gray-400 uppercase tracking-widest">
                Environment Overrides
              </h3>
            </div>

            <div className="flex items-center justify-between p-1 font-semibold">
              <div>
                <span className="font-bold text-gray-900 block text-[11px]">
                  Sandbox Training Sandbox Sandbox
                </span>
                <span className="text-[9px] text-gray-400">
                  Isolate order creation pipelines from actual live accounting
                  logs
                </span>
              </div>
              <input
                type="checkbox"
                checked={trainingMode}
                onChange={(e) => setTrainingMode(e.target.checked)}
                className="w-4 h-4 accent-black cursor-pointer"
              />
            </div>
          </div>

          {/* Sticky Bottom Settings Action Panel Footer */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2 shrink-0 bg-white">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-black text-[10px] transition-colors"
            >
              <RefreshCw size={11} /> Soft Reload
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-black hover:bg-gray-800 text-white font-black text-[10px] rounded-xl transition-all active:scale-95 shadow-md"
            >
              Save Parameters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
