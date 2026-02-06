import { Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-yellow-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
        <WifiOff className="w-4 h-4" />
        <span className="text-sm font-medium">You're offline - Some features may be limited</span>
      </div>
    </div>
  );
}
