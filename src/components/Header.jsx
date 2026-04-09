import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentShift } from "../utils/shift.util";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import NotificationBell from "./NotificationBell";
import OpenShiftModal from "./Shifts/OpenShiftModal";
import CloseShiftModal from "./Shifts/CloseShiftModal";

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [shift, setShift] = useState(null);
  const dropdownRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isOpenShiftModal, setIsOpenShiftModal] = useState(false);
  const [isCloseShiftModal, setIsCloseShiftModal] = useState(false);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page with query parameter
      alert("Search results for: " + searchQuery);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm max-h-16 fixed top-0 right-0 left-0 md:left-40 z-10">
      <div className="flex items-center justify-between px-6 py-1">
        {/* Search Bar */}
        <div className="flex-1 md:block hidden max-w-xl pl-8">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, orders, customers..."
              className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4 ml-6">
          {/* Shift Button (Cashier only) */}
          {role === "Cashier" && (
            <>
              {!shift ? (
                <button
                  onClick={() => setIsOpenShiftModal(true)}
                  className="px-3 py-2 text-sm ml-10 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
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
          <NotificationBell />

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
              <span>
                {dropdownOpen ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-gray-600" />
                )}
              </span>
            </button>

            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
              >
                <Link
                  to={profilePath}
                  className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to={settingsPath}
                  className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
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

      {/* Shift Modals */}
      <OpenShiftModal
        isOpen={isOpenShiftModal}
        onClose={() => setIsOpenShiftModal(false)}
        onShiftOpened={setShift}
      />

      <CloseShiftModal
        isOpen={isCloseShiftModal}
        onClose={() => setIsCloseShiftModal(false)}
        shift={shift}
        onShiftClosed={() => setShift(null)}
      />
    </header>
  );
};

export default Header;
