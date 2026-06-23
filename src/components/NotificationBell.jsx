import { useState, useEffect, useRef } from "react";
import { BellDot } from "lucide-react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const NotificationBell = ({ role }) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch stored notifications for this role
    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/notifications?role=${role}`,
        );
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };
    fetchNotifications();

    // Persistent socket connection
    const socket = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket"],
    });

    // Join role room after connect
    socket.on("connect", () => {
      socket.emit("joinRole", role);
      console.log(`Joined role room: ${role}`);
    });

    // Listen for live notifications
    socket.on("notification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    return () => {
      socket.off("notification");
      socket.disconnect();
    };
  }, [role]);

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

  const handleNotificationClick = async (notif) => {
    if (notif.targetUrl) {
      navigate(notif.targetUrl);
    }

    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/notifications/${notif.id}/read`,
        { method: "PATCH" },
      );

      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n)),
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
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

      {/* Dropdown */}
      {open && (
        <div className="absolute w-80 -right-34 mt-3 max-w-500 bg-white shadow-lg rounded-lg overflow-hidden z-50">
          <div className="p-3 border-b bg-blue-600 text-center font-semibold text-white">
            Notifications
          </div>
          <ul className="max-h-64 text-gray-600 text-sm overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="p-2 text-gray-500 text-sm text-center">
                No notifications
              </li>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3 text-sm cursor-pointer border-b ${
                    n.read
                      ? "bg-gray-50 text-gray-400"
                      : "bg-white hover:bg-gray-100 font-medium"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="flex-1">
                      {n.user?.full_name ? `${n.message}` : n.message}
                    </span>
                    {!n.read && (
                      <span className="ml-2 text-xs text-blue-600">New</span>
                    )}
                  </div>
                  <div className="mt-1 text-[9px] text-gray-400">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
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
