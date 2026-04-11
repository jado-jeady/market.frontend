import { useState, useEffect, useMemo } from "react";
import { getAllShifts } from "../../../utils/shift.util";
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
} from "lucide-react";

const GetShifts = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usernames, setUsernames] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);

  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleOpenModal = (shift) => {
    setSelectedShift(shift);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedShift(null);
    setIsModalOpen(false);
  };

  const fetchShifts = async () => {
    setLoading(true);
    try {
      const response = await getAllShifts({ limit: 1000000, page: 1 });
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

  return (
    <div className="p-4 md:p-6 text-gray-600 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Shifts</h3>
          <p className="text-xs text-gray-500">Monitor cashier sessions</p>
        </div>
        <button
          onClick={fetchShifts}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors bg-white border"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Cashier..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-xs bg-gray-50 outline-none"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-xs bg-gray-50 outline-none appearance-none"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
          <p className="text-xs text-gray-400">Syncing shift data...</p>
        </div>
      ) : (
        <>
          {/* MOBILE GRID VIEW */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredShifts.map((shift) => (
              <div
                key={shift.id}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">
                        {usernames[shift.cashier_id] || "..."}
                      </h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-tighter">
                        ID: #{shift.id}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                      shift.status === "OPEN"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {shift.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-y-3 py-3 border-t border-b border-gray-50 my-3">
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase font-bold">
                      Sales
                    </p>
                    <p className="text-xs font-black text-gray-800">
                      {Number(shift.total_sales).toLocaleString()} RWF
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase font-bold">
                      Difference
                    </p>
                    <p
                      className={`text-xs font-black ${Number(shift.difference) < 0 ? "text-red-500" : "text-green-600"}`}
                    >
                      {shift.difference || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Store className="w-3 h-3" />{" "}
                    <span className="text-[10px]">{shift.shop_name}</span>
                  </div>
                  {shift.status === "OPEN" && (
                    <button
                      onClick={() => handleOpenModal(shift)}
                      className="px-4 py-2 bg-red-600 text-white text-[10px] font-black uppercase rounded-lg"
                    >
                      Close Shift
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-wider border-b">
                <tr>
                  <th className="px-4 py-4 text-left">Cashier</th>
                  <th className="px-4 py-4 text-left">Open Note</th>
                  <th className="px-4 py-4 text-center">Status</th>
                  <th className="px-4 py-4 text-right">Opening</th>
                  <th className="px-4 py-4 text-right">Opened At</th>
                  <th className="px-4 py-4 text-right">Closing</th>
                  <th className="px-4 py-4 text-right">Closed At</th>
                  <th className="px-4 py-4 text-right">Sales</th>
                  <th className="px-4 py-4 text-right">Diff</th>
                  <th className="px-4 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-700">
                {filteredShifts.map((shift) => (
                  <tr
                    key={shift.id}
                    className="hover:bg-blue-50/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-bold text-gray-800">
                        {usernames[shift.cashier_id] || "..."}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        ID: {shift.id}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs">{shift.opening_note}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                          shift.status === "OPEN"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {shift.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs">
                      {Number(shift.opening_balance).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs">
                      {new Date(shift.opened_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs">
                      {Number(shift.closing_balance).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs">
                      {new Date(shift.closed_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs">
                      {Number(shift.opening_balance).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-bold">
                      {Number(shift.total_sales).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`font-bold ${Number(shift.difference) < 0 ? "text-red-500" : "text-green-600"}`}
                      >
                        {shift.difference || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {shift.status === "OPEN" && (
                        <button
                          onClick={() => handleOpenModal(shift)}
                          className="px-4 py-1.5 bg-red-600 text-white text-[10px] font-black uppercase rounded shadow-sm"
                        >
                          Close
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredShifts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed text-gray-400 italic">
              No matching shifts found.
            </div>
          )}
        </>
      )}

      <AdminCloseShiftModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        shift={selectedShift}
        onShiftClosed={fetchShifts}
      />
    </div>
  );
};

export default GetShifts;
