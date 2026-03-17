"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DINEng } from "@/lib/fonts";

export type StationItem = {
  id: number;
  title: string;
  subtitle?: string;
  href: string;
};

// Standard Journey Steps
export const journeySteps: StationItem[] = [
  { id: 1, title: "STATION 01", subtitle: "SELECT LAYOUT", href: "/grid-layout-selection" },
  { id: 2, title: "STATION 02", subtitle: "CAPTURE PHOTOS", href: "/capture-photos" },
  { id: 3, title: "STATION 03", subtitle: "PHOTO GALLERY", href: "/grid-gallery-selection" },
  { id: 4, title: "STATION 04", subtitle: "SHARE RESULTS", href: "/grid-results" },
];


// Arduino Day Philippines Color Scheme
const COLORS = {
  COMPLETED: "#00CED1",  // Teal for completed
  ACTIVE: "#FF6B35",     // Orange for active
  FUTURE: "#4A5568",     // Muted gray for future
  LINE: "#1a3a4a",       // Dark teal for line
};

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

/**
 * Sidebar - Global navigation sidebar
 * Desktop: Fixed on left
 * Mobile: Hidden behind hamburger, slides in as overlay
 */
export default function Sidebar({
  isOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  // Determine active station based on path
  // This is a simple heuristic. You might need more complex logic for sub-routes.
  const activeStationId = React.useMemo(() => {
    // Based on the new journeySteps, the first step is grid-layout-selection
    if (pathname.includes("grid-layout")) return 1;
    if (pathname.includes("capture-photos")) return 2;
    if (pathname.includes("grid-gallery")) return 3;
    if (pathname.includes("grid-results")) return 4; // implied end state
    return 0; // No active station
  }, [pathname]);

  const activeIndex = journeySteps.findIndex(s => s.id === activeStationId);

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside
        className={`
          fixed inset-y-0 right-0 lg:left-0 lg:right-auto z-50
          w-72 
          bg-[rgba(13,27,42,0.95)] backdrop-blur-xl border-l lg:border-r lg:border-l-0 border-[rgba(0,206,209,0.2)]
          flex flex-col justify-between p-6
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}
        style={{ fontFamily: 'TT Firs Neue Trial Var Roman, sans-serif' }}
      >
        <div className="flex-1 flex flex-col">
          {/* Header Section */}
          <div className="mb-6 flex justify-between items-start">
            <Link href="/" onClick={onClose} className="block group">
              <h2 className={`text-4xl font-extrabold tracking-tight text-white group-hover:opacity-80 transition-opacity`}>
                Snap<span className="text-[#00CED1]">Grid</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1 group-hover:text-gray-300 transition-colors">Your photobooth journey</p>
            </Link>
            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <hr className="border-[rgba(0,206,209,0.3)] mb-6"></hr>

          {/* Status Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <svg width="20" height="12" viewBox="0 0 32 16" fill="none" aria-hidden>
                <path d="M20 3l7 5-7 5" stroke="#00CED1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 8h22" stroke="#00CED1" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <h4 className={`text-lg text-[#00CED1] uppercase tracking-wide font-semibold ${DINEng.className}`}>Your Journey</h4>
            </div>

            {/* Navigation/Station List */}
            <nav className="relative space-y-6">
              {/* The vertical line behind the dots */}
              <div
                aria-hidden
                className="absolute top-2 bottom-2 w-[2px] bg-[#1a3a4a]"
                style={{ left: "5px" }}
              />

              {journeySteps.map((st, index) => {
                const isActive = st.id === activeStationId;

                // Color Logic
                let statusColor = COLORS.FUTURE;
                if (index < activeIndex || (activeIndex === -1 && activeStationId > st.id)) statusColor = COLORS.COMPLETED;
                if (isActive) statusColor = COLORS.ACTIVE;
                if ((activeStationId as number) === 5) statusColor = COLORS.COMPLETED; // Assuming 5 is results


                const dotSize = isActive ? 16 : 10;

                const indicatorStyle: React.CSSProperties = {
                  backgroundColor: statusColor,
                  width: `${dotSize}px`,
                  height: `${dotSize}px`,
                  // Removed marginLeft, using flex positioning in container
                  transition: 'all 0.3s ease',
                  boxShadow: isActive ? `0 0 12px ${statusColor}` : 'none'
                };

                const titleColor = isActive ? "text-white" : (statusColor === COLORS.COMPLETED ? "text-[#00CED1]" : "text-gray-400");
                const subtitleColor = isActive ? "text-white" : "text-gray-500";

                return (
                  <Link
                    key={st.id}
                    href={st.href}
                    onClick={() => onClose?.()}
                    className="w-full flex items-start gap-6 text-left group hover:bg-[rgba(0,206,209,0.05)] p-2 -ml-2 rounded-lg transition-colors relative"
                  >
                    {/* The Dot Container to help alignment */}
                    <div className="flex-none w-3 flex justify-center mt-1.5 relative z-10">
                      <span
                        className="rounded-full block"
                        style={indicatorStyle}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold uppercase ${titleColor} transition-colors`}>
                          {st.title}
                        </p>

                        {/* ACTIVE Badge */}
                        {isActive && (
                          <span
                            className="ml-2 bg-[#FF6B35] text-white text-xs px-2 py-0.5 rounded-full"
                            style={{
                              fontSize: "0.6rem",
                              fontFamily: "Arial, Helvetica, sans-serif"
                            }}
                          >
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className={`text-sm uppercase font-semibold mt-0.5 ${subtitleColor} ${DINEng.className} transition-colors`}>
                        {st.subtitle}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="text-xs text-gray-400 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#00CED1] shadow-[0_0_8px_rgba(0,206,209,0.6)]" />
          <span>SYSTEM READY</span>
        </div>
      </aside>
    </>
  );
}
