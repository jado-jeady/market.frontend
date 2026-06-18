import { useEffect, useState } from "react";

function OfflineToast() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showOnlineMsg, setShowOnlineMsg] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      setShowOnlineMsg(false); // hide online message if offline again
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowOnlineMsg(true);
      setTimeout(() => setShowOnlineMsg(false), 10000); // hide after 10s
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <>
      {isOffline && (
        <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center py-2 z-50">
          You are offline — some features may not be available.
        </div>
      )}
      {showOnlineMsg && (
        <div className="fixed top-0 left-0 w-full bg-green-600 text-white text-center py-2 z-50">
          Restored connection, You are back online — All features available.
        </div>
      )}
    </>
  );
}

export default OfflineToast;
