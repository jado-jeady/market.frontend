import { useState, useEffect, useMemo } from "react";
import { getShiftsOnly } from "../../../utils/shift.util";
import { getUserNameById } from "../../../utils/user.util";
import { toast } from "react-toastify";
import AdminCloseShiftModal from "../../../components/Shifts/AdminCloseShiftModal.jsx";
import {
  Loader2,
  Search,
  Filter,
  RefreshCcw,
  User,
  Store,
  Banknote,
  History,
  Eye,
  X,
  Calendar,
  ClipboardList,
  Info,
} from "lucide-react";

const GetShifts = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usernames, setUsernames] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);

  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleOpenModal = (shift) => {
    setSelectedShift(shift);
    setIsModalOpen(true);
  };

  const handleOpenDetails = (shift) => {
    setSelectedShift(shift);
    setIsDetailsOpen(true);
  };

  const fetchShifts = async () => {
    setLoading(true);
    try {
      const response = await getShiftsOnly();
      if (response.success) {
        setShifts(response.data);
        const uniqueIds = [...new Set(response.data.map((s) => s.cashier_id))];
        const nameMap = {};
        await Promise.all(
          uniqueIds.map(async (id) => {
            const userRes = await getUserNameById(id);
            nameMap[id] =
              userRes?.data?.full_name || userRes.username || "Unknown User";
          }),
        );
        setUsernames(nameMap);
      }
    } catch (error) {
      toast.error("Failed to load shifts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const filteredShifts = useMemo(() => {
    return shifts.filter((shift) => {
      const cashierName = usernames[shift.cashier_id]?.toLowerCase() || "";
      const matchesName = cashierName.includes(searchName.toLowerCase());
      const matchesStatus =
        statusFilter === "" || shift.status === statusFilter;
      return matchesName && matchesStatus;
    });
  }, [shifts, searchName, statusFilter, usernames]);

  const formatNum = (val) =>
    isNaN(Number(val)) ? "0" : Number(val).toLocaleString();

  return (
    <div className="p-1  md:p-2 lg:p-4 bg-gray-50/50 min-h-screen text-gray-600">
      {/* HEADER */}
      <div className="flex mb-2 flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight ">
            Shift Audit
          </h3>
          <p className="text-xs text-gray-500 tracking-widest">
            Manage and monitor cashier sessions
          </p>
        </div>
        <button
          onClick={fetchShifts}
          className="flex items-center justify-center gap-2 bg-white border px-4 py-2 rounded-xl text-xs font-black  tracking-widest hover:bg-gray-50 transition-all shadow-sm"
        >
          <RefreshCcw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
          />
          Sync
        </button>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2 bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Cashier..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full pl-9 pr-2 py-2.5 border-2 border-gray-50 rounded-xl text-xs bg-gray-100 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-50 rounded-xl text-xs bg-gray-100 outline-none appearance-none font-bold"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Active Sessions</option>
            <option value="CLOSED">Completed Shifts</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">
            Syncing shifts...
          </p>
        </div>
      ) : (
        <>
          {/* MOBILE GRID VIEW */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredShifts.map((shift) => (
              <div
                key={shift.id}
                className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 leading-none">
                        {usernames[shift.cashier_id] || "..."}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                        Ref: #{shift.id}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter ${shift.status === "OPEN" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}
                  >
                    {shift.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-50 my-4">
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">
                      Revenue
                    </p>
                    <p className="text-sm font-black text-gray-900">
                      {formatNum(shift.total_sales)} F
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">
                      Difference
                    </p>
                    <p
                      className={`text-sm font-black ${Number(shift.difference) < 0 ? "text-red-500" : "text-green-600"}`}
                    >
                      {formatNum(shift.difference)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenDetails(shift)}
                    className="flex-1 py-3 bg-gray-50 text-gray-600 text-[10px] font-black uppercase rounded-xl flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" /> View Details
                  </button>
                  {shift.status === "OPEN" && (
                    <button
                      onClick={() => handleOpenModal(shift)}
                      className="flex-1 py-3 bg-red-600 text-white text-[10px] font-black uppercase rounded-xl shadow-lg shadow-red-100"
                    >
                      Close Shift
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-lg">
              <thead className="bg-gray-50/50 border-b">
                <tr className="text-sm font-poppins text-gray-700">
                  <th className="px-2 py-2 text-center ">Cashier & Store</th>
                  <th className="px-2 py-2 text-center">Status</th>
                  <th className="px-2 py-2 text-center">Opening Momo </th>
                  <th className="px-2 py-2 text-center">Closing Momo</th>
                  <th className="px-2 py-2 text-center">Net Sales</th>
                  <th className="px-2 py-2 text-right">Difference</th>
                  <th className="px-2 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y font-poppins divide-gray-50">
                {filteredShifts.map((shift) => (
                  <tr
                    key={shift.id}
                    className="hover:bg-blue-50/20 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-white transition-all">
                          <User className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-black text-gray-900">
                            {usernames[shift.cashier_id] || "..."}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter flex items-center gap-1">
                            <Store className="w-3 h-3" /> {shift.shop_name} •
                            ID: {shift.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${shift.status === "OPEN" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}
                      >
                        {shift.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right font-mono text-xs text-gray-400">
                      {formatNum(shift.opening_balance)}
                    </td>
                    <td className="px-8 py-5 text-right font-mono text-xs text-gray-400">
                      {formatNum(shift.closing_balance)}
                    </td>
                    <td className="px-8 py-5 text-right font-black text-gray-900">
                      {formatNum(shift.total_sales)} F
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span
                        className={`font-black ${Number(shift.difference) < 0 ? "text-red-500" : "text-green-600"}`}
                      >
                        {formatNum(shift.difference)}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleOpenDetails(shift)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {shift.status === "OPEN" && (
                          <button
                            onClick={() => handleOpenModal(shift)}
                            className="px-4 py-1.5 bg-red-600 text-white text-[10px] font-black uppercase rounded-lg shadow-sm"
                          >
                            Close
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* SHIFT DETAILS MODAL */}
      {isDetailsOpen && selectedShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gray-900 p-8 text-white flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${selectedShift.status === "OPEN" ? "bg-yellow-500" : "bg-emerald-500"}`}
                  >
                    {selectedShift.status} SESSION
                  </span>
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  {usernames[selectedShift.cashier_id]}
                </h2>
                <p className="text-gray-400 text-xs font-bold uppercase mt-1 tracking-widest flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" /> Shift Date:{" "}
                  {selectedShift.business_date}
                </p>
              </div>
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-1 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Financial Summary */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                    <Banknote className="w-4 h-4" /> Financial Summary
                  </h4>
                  <div className="space-y-3 bg-gray-50 p-5 rounded-3xl">
                    <DetailItem
                      label="Opening Momo Balance"
                      val={`${formatNum(selectedShift.opening_balance)} F`}
                    />

                    <DetailItem
                      label="Closing Momo Balance"
                      val={
                        selectedShift.closing_balance >= 0
                          ? `${formatNum(selectedShift.closing_balance)} F`
                          : "Pending"
                      }
                    />

                    <DetailItem
                      label="Petty Cash"
                      val={
                        selectedShift.petty_cash
                          ? `${formatNum(selectedShift.petty_cash)} F`
                          : "Not Provided"
                      }
                    />

                    <DetailItem
                      label="Cash In hand"
                      val={selectedShift.cash_in_hand}
                    />

                    <DetailItem
                      label="Total Sales"
                      val={`${formatNum(selectedShift.total_sales)} F`}
                    />

                    <DetailItem
                      label="Expected Balance"
                      val={`${formatNum(selectedShift.expected_balance)} F`}
                    />
                    <DetailItem
                      label="Available Balance"
                      val={selectedShift.available_balance}
                    />
                    <div className="pt-2 mt-2 border-t flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-400 uppercase">
                        Net Difference
                      </span>
                      <span
                        className={`font-black ${Number(selectedShift.difference) > 0 ? "text-green-500" : "text-red-600"}`}
                      >
                        {formatNum(selectedShift.difference)} F
                      </span>
                    </div>
                    <div>
                      <label>Descion:</label>{" "}
                      {selectedShift.difference > 0 ? "Profit" : "Loss"}{" "}
                    </div>
                  </div>

                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2 flex items-center gap-2 mt-8">
                    <History className="w-4 h-4" /> Shift Logs
                  </h4>
                  <div className="space-y-3 bg-gray-50 p-5 rounded-3xl">
                    <DetailItem
                      label="Opened At"
                      val={new Date(selectedShift.opened_at).toLocaleString()}
                    />
                    <DetailItem
                      label="Closed At"
                      val={
                        selectedShift.closed_at
                          ? new Date(selectedShift.closed_at).toLocaleString()
                          : "Still Active"
                      }
                    />
                    <DetailItem
                      label="Opening Note"
                      val={selectedShift.opening_note || "No note provided"}
                    />
                    <DetailItem
                      label="Closing Note"
                      val={selectedShift.closing_note || "No note provided"}
                    />
                  </div>
                </div>

                {/* Inventory Snapshot */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                    <ClipboardList className="w-4 h-4" /> Consumables Snapshot
                  </h4>
                  <div className="bg-gray-50 p-5 rounded-3xl max-h-[350px] overflow-y-auto">
                    {selectedShift.consumables_snapshot ? (
                      Object.entries(selectedShift.consumables_snapshot).map(
                        ([item, qty]) => (
                          <div
                            key={item}
                            className="flex justify-between py-2 border-b border-gray-100 last:border-0 text-xs"
                          >
                            <span className="text-gray-500 font-bold">
                              {item}
                            </span>
                            <span className="font-black text-blue-600">
                              {qty}
                            </span>
                          </div>
                        ),
                      )
                    ) : (
                      <p className="text-[10px] text-gray-400 italic">
                        No snapshot recorded for this shift.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t flex justify-end">
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="px-8 py-3 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminCloseShiftModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        shift={selectedShift}
        onShiftClosed={fetchShifts}
      />
    </div>
  );
};

const DetailItem = ({ label, val }) => (
  <div className="flex justify-between items-center text-xs">
    <span className="text-gray-400 font-bold uppercase tracking-tighter">
      {label}:
    </span>
    <span className="font-black text-gray-800 text-right max-w-[150px] truncate">
      {val}
    </span>
  </div>
);

export default GetShifts;
