import { useState, useEffect, useRef } from "react";
import { BellDot } from "lucide-react";
import { initSocket } from "../utils/socket";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const socket = initSocket("https://your-backend-url");

    socket.on("notification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    return () => {
      socket.off("notification"); // clean up listener
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
      >
        <BellDot size={20} className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute w-80 -right-34 mt-3 max-w-500 bg-gray-100 shadow-lg rounded-lg overflow-hidden z-50">
          <div className="p-3 border-b bg-red-600 text-center font-semibold text-white">
            Notifications
          </div>
          <ul className="max-h-64 text-gray-600 text-sm text-center overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="p-2 text-white bg-red-500 text-sm">
                No new notifications
              </li>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.id}
                  className="p-3 text-sm hover:bg-gray-50 flex justify-between"
                >
                  <span>{n.message}</span>
                  {!n.read && (
                    <span className="text-xs text-blue-600 font-medium">
                      New
                    </span>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
