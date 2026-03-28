import { useState, useEffect } from "react";
import {
  getAllShifts,
  closeShift,
  abortShift,
} from "../../../utils/shift.util";
import { getUserNameById } from "../../../utils/user.util";
import { toast } from "react-toastify";
import AdminCloseShiftModal from "../../../components/Shifts/AdminCloseShiftModal.jsx";

const GetShifts = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usernames, setUsernames] = useState({}); // Stores { id: "Name" }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);

  const handleOpenModal = (shift) => {
    setSelectedShift(shift);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setSelectedShift(null);
    setIsModalOpen(false);
  };
  const handleShiftClosed = () => {
    // refresh shifts or update UI
    console.log("Shift closed by admin");
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await getAllShifts({ limit: 1000000, page: 1 });

      if (response.success) {
        setShifts(response.data);

        // Fetch usernames for all unique cashier IDs
        const uniqueIds = [...new Set(response.data.map((s) => s.cashier_id))];
        const nameMap = {};

        await Promise.all(
          uniqueIds.map(async (id) => {
            const userRes = await getUserNameById(id);
            console.log("User response:", userRes);
            // Adjust 'userRes.username' based on your actual API response structure
            nameMap[id] =
              userRes?.data?.full_name || userRes.username || "Unknown";
          }),
        );

        setUsernames(nameMap);
      }
      setLoading(false);
    })();
  }, []);

  // ... handleCloseShift and handleAbortShift remain the same ...

  if (loading)
    return <p className="text-center text-gray-500">Loading shifts...</p>;

  return (
    <div className="p-6 text-gray-600">
      <h3 className="text-xl font-bold mb-4">Shift Management</h3>
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Shift ID</th>
              <th className="px-4 py-3 text-left">Cashier</th>
              <th className="px-4 py-3 text-left">Shop</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Opening Balance</th>
              <th className="px-4 py-3 text-right">Closing Balance</th>
              <th className="px-4 py-3 text-right">Total Sales</th>
              <th className="px-4 py-3 text-right">Difference</th>
              <th className="px-4 py-3 text-center">Actions</th>
              {/* ... other headers ... */}
            </tr>
          </thead>
          <tbody className="divide-y text-gray-700">
            {shifts.map((shift) => (
              <tr key={shift.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{shift.id}</td>
                {/* Look up name from our state map */}
                <td className="px-4 py-3 font-medium">
                  {usernames[shift.cashier_id] || "Loading..."}
                </td>
                <td className="px-4 py-3">{shift.shop_name}</td>
                {/* ... rest of your row ... */}
                <td className="px-4 py-3 text-center">{shift.status}</td>
                <td className="px-4 py-3 text-right">
                  {shift.opening_balance || "-"}
                </td>
                <td className="px-4 py-3 text-right">
                  {shift.closing_balance || "-"}
                </td>
                <td className="px-4 py-3 text-right">
                  {shift.total_sales || 0}
                </td>
                <td className="px-4 py-3 text-right">
                  {shift.difference || 0}
                </td>
                <td className="px-4 py-3 text-center space-x-2">
                  {(shift.status === "OPEN" && (
                    <button
                      onClick={() => handleOpenModal(shift)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Close
                    </button>
                  )) ||
                    (shift.status === "CLOSED" && (
                      <p className="px-3 py-1 text-green-800 italic rounded">
                        Closed
                      </p>
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Admin modal */}
        <AdminCloseShiftModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          shift={selectedShift}
          onShiftClosed={handleShiftClosed}
        />
      </div>
    </div>
  );
};

export default GetShifts;
