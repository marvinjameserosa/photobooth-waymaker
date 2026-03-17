"use client";
import React, { useEffect } from "react";
import BokehBackground from "@/components/ui/BokehBackground";

import { useRouter } from "next/navigation";

export default function GridLayout() {
  const router = useRouter();

  useEffect(() => {
    const elevatorConfig = {
      id: 3,
      size: 4,
      columns: 1,
      title: "ELEVATOR",
      subtitle: "Vertical Strip",
    };

    sessionStorage.setItem("photobooth_config", JSON.stringify(elevatorConfig));
    router.replace("/capture-photos?station=3");
  }, [router]);

  return (
    <div className="min-h-screen flex text-gray-100">
      <BokehBackground />
      <main className="relative flex flex-1 items-center justify-center p-6 md:p-12 pt-24">
        <div className="relative z-10 rounded-xl border border-[rgba(0,206,209,0.3)] bg-[rgba(13,27,42,0.7)] px-8 py-10 text-center backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.25em] text-[#00CED1]">
            Elevator selected
          </p>
          <p className="mt-3 text-sm text-gray-300">
            Redirecting to capture...
          </p>
        </div>
      </main>
    </div>
  );
}
