import { useEffect, useState } from "react";

function OfflineToast() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      setVisible(true);
      setTimeout(() => setVisible(false), 4000); // auto-hide after 4s
    };
    const handleOnline = () => {
      setIsOffline(false);
      setVisible(true);
      setTimeout(() => setVisible(false), 4000);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg text-white transition-opacity duration-300 ${
        isOffline ? "bg-red-600" : "bg-green-600"
      }`}
    >
      {isOffline
        ? "You are offline — some features may not be available."
        : "Back online — all features restored."}
    </div>
  );
}

export default OfflineToast;
