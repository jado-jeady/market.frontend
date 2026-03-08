import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentShift, closeShift, openShift } from "../utils/shift.util";
import { BellDot, ChevronDown, ChevronUp } from "lucide-react";

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [shift, setShift] = useState(null);

  // Modal states
  const [isOpenShiftModal, setIsOpenShiftModal] = useState(false);
  const [isCloseShiftModal, setIsCloseShiftModal] = useState(false);
  //refresh shift
   const refreshShift = async () => {
  const response = await getCurrentShift();
  if (response.success) {
    setShift(response.data);
  } else {
    setShift(null);
  }
};


  // Form fields
  const [openingBalance, setOpeningBalance] = useState("");
  const [shiftNote, setShiftNote] = useState("");
  const [closingBalance, setClosingBalance] = useState("");
  const [closingNote, setClosingNote] = useState("");

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser)?.data?.user : null;
  const role = user?.role;

  const profilePath =
    role === "Admin"
      ? "/admin/profile"
      : role === "Storekeeper"
      ? "/storekeeper/profile"
      : "/cashier/profile";

  const settingsPath =
    role === "Admin"
      ? "/admin/settings"
      : role === "Storekeeper"
      ? "/storekeeper/settings"
      : "/cashier/settings";

  useEffect(() => {
    if (role === "Cashier") {
      (async () => {
        const response = await getCurrentShift();
        if (response.success) setShift(response.data);
      })();
    }
  }, [role]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm max-h-16 fixed top-0 right-0  left-0 md:left-40 z-10">
      <div className="flex items-center justify-between px-6 py-1">
        {/* Search Bar */}
        <div className="flex-1 md:block hidden max-w-xl pl-8">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4 ml-6">
          {/* Shift Button (Cashier only) */}
          {role === "Cashier" && (
            <>
              {!shift ? (
                <button
                  onClick={() => setIsOpenShiftModal(true)}
                  className="px-3 py-2 text-sm ml-10 text-white bg-blue-600  rounded-lg hover:bg-blue-700"
                >
                  Open Shift
                </button>
              ) : (
                <button
                  onClick={() => setIsCloseShiftModal(true)}
                  className="px-3 py-2 text-sm ml-10 text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
                >
                  Close Shift
                </button>
              )}
            </>
          )}

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
            <BellDot size={16} className="w-6 h-6" />
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <div className="text-left">
                <p className="text-sm font-semibold font-medium text-gray-900">
                  {role || "User"}
                </p>
                <p className="text-xs hidden md:block text-gray-500">
                  {user?.full_name || "User"}
                </p>
              </div>
              <span>{dropdownOpen ? <ChevronDown className="w-4 h-4 text-gray-600" /> : <ChevronUp className="w-4 h-4 text-gray-600" />}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <Link to={profilePath} className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100">
                  Profile
                </Link>
                <Link to={settingsPath} className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100">
                  Settings
                </Link>
                <div className="border-t border-gray-200 my-2"></div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Open Shift Modal */}
      {isOpenShiftModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="bg-white text-gray-700 rounded-lg shadow-lg p-6 w-96">
      <h2 className="text-xs md:text-lg  font-bold mb-4">Open Shift</h2>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!openingBalance || Number(openingBalance) <= 0) {
            alert("Opening balance must be greater than 0");
            return;
          }
          const start_time = new Date().toISOString();
          const response = await openShift({
            opening_balance: openingBalance,
            start_time,
            shop_name: "Tyag_market",
            user,
            opening_note: shiftNote,
          });
          if (response.success) {
            setShift(response.data);
            setIsOpenShiftModal(false);
            setOpeningBalance("");
            setShiftNote("");
          } else {
            alert(response.message);
          }
        }}
      >
        <label className="block mb-2 text-xs">Opening Balance</label>
        <input
          type="number"
          value={openingBalance}
          onChange={(e) => setOpeningBalance(e.target.value)}
          className="w-full text-xs text-gray-500 border rounded px-3 py-2 mb-4"
          required
          min="1"
        />

        <label className="block mb-2 text-xs">Shift Note</label>
        <textarea
          value={shiftNote}
          onChange={(e) => setShiftNote(e.target.value)}
          className="w-full text-gray-500 text-xs border rounded px-3 py-2 mb-4"
          placeholder="Enter shift note"
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsOpenShiftModal(false)}
            className="px-2 py-1 bg-gray-300 text-xs rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-2 py-1  bg-green-600 text-xs text-white rounded"
          >
            Open Shift
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      {/* Close Shift Modal */}
      {isCloseShiftModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="bg-white text-gray-700 rounded-lg shadow-lg p-6 w-96">
      <h2 className="lg:text-lg text-xs font-bold mb-1 nonem text-center nowrap">Close Shift</h2>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!closingBalance || Number(closingBalance) <= 0) {
            alert("Closing balance must be greater than 0");
            return;
          }
          const response = await closeShift({
            shiftId: shift.id,
            closingBalance,
            closing_note: closingNote,
          });
          if (response.success) {
            alert("Shift closed successfully!");
            setShift(null);
            setIsCloseShiftModal(false);
            setClosingBalance("");
            setClosingNote("");
          } else {
            alert(response.message);
          }
        }}
      >
        <label className="block mb-2 text-xs">Closing Balance</label>
        <input
          type="number"
          value={closingBalance}
          onChange={(e) => setClosingBalance(e.target.value)}
          className="w-full text-xs text-gray-500 border rounded px-3 py-2 mb-4"
          required
          min="1"
        />

        <label className="block mb-2 text-xs">Closing Note</label>
        <textarea
          value={closingNote}
          onChange={(e) => setClosingNote(e.target.value)}
          className="w-full text-xs border rounded px-3 py-2 mb-4"
          placeholder="Enter closing note"
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsCloseShiftModal(false)}
            className="px-2 py-1 text-gray-500 bg-gray-300 text-xs rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-2 py-1 bg-red-600 text-xs text-white rounded"
          >
            Close Shift
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </header>
  );
};

export default Header;