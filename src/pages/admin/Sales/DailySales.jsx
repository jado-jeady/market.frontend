import { useEffect, useState } from "react";
import { getTodaySales as getSalesByDate } from "../../../utils/sales.util";
import { getShiftBusinessDates as getShiftByBusinessDate } from "../../../utils/shift.util";

const DailySales = () => {
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [salesSummary, setSalesSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const response = await getShiftByBusinessDate();
      if (response?.success && response.data.length > 0) {
        const uniqueDates = [
          ...new Set(response.data.map((d) => d.business_date)),
        ];
        const sortedDates = uniqueDates.sort(
          (a, b) => new Date(b) - new Date(a),
        );

        setAvailableDates(sortedDates);
        setSelectedDate(sortedDates[0]);
      } else {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    (async () => {
      setLoading(true);
      const response = await getSalesByDate(selectedDate);
      console.log(response);
      if (response?.success) setSalesSummary(response.data);
      else setSalesSummary([]);

      console.log(salesSummary);
      console.log("above id the sales summary");
      setLoading(false);
    })();
  }, [selectedDate]);

  return (
    <div className="p-4 md:p-6 text-gray-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl text-gray-900">Performance Summary</h3>
          <p className="text-xs text-gray-500">
            Showing data for :{" "}
            <span className="text-blue-600">{selectedDate}</span>
          </p>
        </div>

        <div className="w-full/2 md:w-64">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
            Select Date
          </label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-2 bg-white shadow-sm focus:border-blue-500 outline-none cursor-pointer font-medium"
          >
            {availableDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {salesSummary.map((item, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition-colors"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-gray-800">
                  {item.user?.full_name}
                </h4>
                <div className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-[10px] font-black uppercase">
                  {item.transaction_count} Trans
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">
                    Total Revenue
                  </p>
                  <p className="text-sm font-black text-gray-700">
                    {Number(item.total_sales).toLocaleString()}{" "}
                    <span className="text-xs text-gray-400">RWF</span>
                  </p>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">
                    <p>Opened</p>
                    <p className="text-gray-600 font-black">
                      {item.shift?.opened_at
                        ? new Date(item.shift.opened_at).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" },
                          )
                        : "--:--"}
                    </p>
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase text-right">
                    <p>Closed</p>
                    <p className="text-gray-600 font-black">
                      {item.shift?.closed_at
                        ? new Date(item.shift.closed_at).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" },
                          )
                        : "ACTIVE"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {!loading && salesSummary.length === 0 && (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="font-bold text-gray-400">
                No transactions recorded for this date.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DailySales;
