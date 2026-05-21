import { useState } from "react";
import { Outlet } from "react-router-dom";
import BaristaSidebar from "../BaristaSidebar";
import Header from "../Header";
import { toggleFullscreenTerminal } from "../../utils/Extrautils";
import { Maximize, Minimize, RefreshCw } from "lucide-react";

const BaristaLayout = () => {
  // define the state here
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(
    !!document.fullscreenElement,
  );
  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.error(err));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200 shadow-sm max-h-16  top-0 right-0 left-0 md:left-0 z-10">
        {/* Buttons for full screen and refresh at the center */}
        <div className="fixed center bottom-4 right-1/2 flex gap-2 z-50">
          <button
            type="button"
            onClick={handleFullscreenToggle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl  text-gray-600 hover:bg-gray-200 font-black text-[10px] transition-colors"
          >
            {isFullscreen ? (
              <Minimize
                size={25}
                className="hover:size-10 transition-2 animate-in"
              />
            ) : (
              <Maximize
                size={25}
                className="hover:size-10 transition-2 animate-in"
              />
            )}
            <span>{isFullscreen ? "" : ""}</span>
          </button>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 px-3 py-1.5  hover:bg-gray-100 text-gray-600 font-black text-[10px] transition-colors"
          >
            <RefreshCw size={25} />
          </button>
        </div>

        <div className="absolute fixed  top-1.5 pl-15 z-50">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="hamburger-trigger w-9 h-9 bg-black text-white rounded-xl flex flex-col items-center justify-center gap-[5px] shadow-lg hover:bg-gray-800 transition-all active:scale-95"
          >
            <span
              className={`block w-4 h-[2px] bg-white rounded transition-all duration-200 ${sidebarOpen ? "rotate-45 translate-y-[7px]" : ""}`}
            />
            <span
              className={`block w-4 h-[2px] bg-white rounded transition-all duration-200 ${sidebarOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-4 h-[2px] bg-white rounded transition-all duration-200 ${sidebarOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
            />
          </button>

          {/* The component pops up cleanly underneath the button, replicating the previous behavior */}
          <BaristaSidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>
        <div className="flex-1 flex flex-col bg-white md:ml-30">
          <Header />
        </div>
      </div>

      {/* <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
      <div className="min-h-screen pt-15 bg-gray-50 flex">
        {/* Content */}

        <div className="flex-1 flex flex-col  bg-white">
          <main className="pt-0 ml-0 md:ml-2">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default BaristaLayout;
