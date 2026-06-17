import React from "react";
import { TrendingUp, DollarSign, Layers } from "lucide-react";

export default function BaristaReports() {
  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col overflow-hidden text-gray-800 text-xs p-3">
      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col h-full overflow-hidden">
        <div className="border-b border-gray-100 pb-3 shrink-0">
          <h2 className="text-base font-black">
            Daily Bar Performance Metrics
          </h2>
          <p className="text-[9px] text-gray-400 uppercase font-semibold tracking-wide">
            Live analytical processing data
          </p>
        </div>

        <div className="flex-1 overflow-y-auto mt-4 space-y-4 min-h-0">
          {/* Statistics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl">
              <DollarSign className="w-4 h-4 text-gray-400 mb-1" />
              <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wide">
                Net Revenue
              </span>
              <span className="text-sm font-black text-gray-900">
                124,500 Frw
              </span>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl">
              <Layers className="w-4 h-4 text-gray-400 mb-1" />
              <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wide">
                Orders Filled
              </span>
              <span className="text-sm font-black text-gray-900">
                58 Tickets
              </span>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl">
              <TrendingUp className="w-4 h-4 text-gray-400 mb-1" />
              <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wide">
                Average Ticket
              </span>
              <span className="text-sm font-black text-gray-900">
                2,145 Frw
              </span>
            </div>
          </div>

          {/* Top Products section */}
          <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl">
            <h3 className="font-bold text-[10px] text-gray-400 uppercase tracking-widest mb-2">
              Top Performer Velocity
            </h3>
            <div className="space-y-2">
              {[
                { name: "Cappuccino", count: 24, percentage: "w-full" },
                { name: "Cafe Latte", count: 18, percentage: "w-3/4" },
                { name: "Espresso", count: 12, percentage: "w-1/2" },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between font-bold text-[11px]">
                    <span className="text-gray-900">{item.name}</span>
                    <span className="text-gray-500">
                      {item.count} items sold
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`bg-black h-full rounded-full ${item.percentage}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
