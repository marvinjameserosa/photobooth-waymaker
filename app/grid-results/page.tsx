"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { generateResultImage } from "@/utils/generateResultImage";
import BokehBackground from "@/components/ui/BokehBackground";

function StationBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-flex items-center justify-center px-10 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#00CED1]">
      <span
        className="absolute inset-0 border border-[#00CED1]/60 rounded-lg"
        aria-hidden
      />
      <span
        className="absolute -top-1 -left-1 h-3 w-3 bg-[#00CED1] rounded-sm"
        aria-hidden
      />
      <span
        className="absolute -top-1 -right-1 h-3 w-3 bg-[#00CED1] rounded-sm"
        aria-hidden
      />
      <span
        className="absolute -bottom-1 -left-1 h-3 w-3 bg-[#00CED1] rounded-sm"
        aria-hidden
      />
      <span
        className="absolute -bottom-1 -right-1 h-3 w-3 bg-[#00CED1] rounded-sm"
        aria-hidden
      />
      <span className="relative tracking-[0.3em]">{children}</span>
    </span>
  );
}

function ResultsPreview({
  config,
  photos,
  previewRef,
}: {
  config: { size: number; columns: number; title: string } | null;
  photos: (string | null)[];
  previewRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const dateLabel = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(now);
  }, [now]);

  const size = config?.size || 4;
  const columns = config?.columns || 2;
  const title = config?.title || "SUBWAY 1";
  const isElevator = title.trim().toUpperCase() === "ELEVATOR";
  const elevatorSlotLayout = {
    leftPct: 20, // match generateResultImage
    widthPct: 62,
    topPct: 15,
    slotHeightPct: 36,
    gapPct: 2,
    horizontalGapPct: 1,
  };

  const grid = (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {Array.from({ length: size }).map((_, index) => (
        <div
          key={index}
          className="relative aspect-square border-4 border-[rgba(0,206,209,0.3)] bg-[rgba(13,27,42,0.8)] overflow-hidden rounded-lg"
        >
          {photos[index] ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={photos[index]!}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-contain object-center"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
              <span className="text-white text-xs font-semibold uppercase tracking-[0.22em]">
                SLOT {String(index + 1).padStart(2, "0")} EMPTY
              </span>
            </div>
          )}
          <span className="absolute bottom-2 right-2 bg-[#00CED1] border-2 border-[rgba(13,27,42,0.8)] text-[#0d1b2a] text-[11px] font-extrabold px-2 py-0.5 rounded">
            {index + 1}
          </span>
        </div>
      ))}
    </div>
  );

  const elevatorTemplate = (
    <div className="relative w-full max-w-6xl aspect-[16/9] mx-auto overflow-hidden rounded-md shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/template/template.png"
        alt="Template"
        className="absolute inset-0 w-full h-full object-contain"
      />
      <div className="absolute inset-0 z-10">
        {Array.from({ length: 4 }).map((_, index) => {
          const row = Math.floor(index / 2);
          const col = index % 2;
          const slotWidth =
            (elevatorSlotLayout.widthPct -
              elevatorSlotLayout.horizontalGapPct) /
            2;
          const slotTop =
            elevatorSlotLayout.topPct +
            row *
              (elevatorSlotLayout.slotHeightPct + elevatorSlotLayout.gapPct);
          const slotLeft =
            elevatorSlotLayout.leftPct +
            col * (slotWidth + elevatorSlotLayout.horizontalGapPct);

          return (
            <div
              key={index}
              className="absolute overflow-hidden"
              style={{
                left: `${slotLeft}%`,
                width: `${slotWidth}%`,
                top: `${slotTop}%`,
                height: `${elevatorSlotLayout.slotHeightPct}%`,
              }}
            >
              {photos[index] ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={photos[index]!}
                  alt={`Photo ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-center">
                  <span className="text-black/55 text-[10px] font-bold uppercase tracking-widest">
                    Empty
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      ref={previewRef}
      className="w-full bg-[rgba(13,27,42,0.55)] border border-[rgba(0,206,209,0.2)] px-2 sm:px-4 py-4 sm:py-6 rounded-xl backdrop-blur-sm shadow-[0_40px_100px_rgba(0,0,0,0.55)] flex flex-col items-center max-w-6xl mx-auto"
    >
      <div className="text-center text-[10px] uppercase tracking-[0.26em] text-[#00CED1] mb-4">
        {dateLabel}
      </div>
      <div className="w-full flex justify-center">
        {isElevator ? elevatorTemplate : grid}
      </div>
    </div>
  );
}

export default function GridResultsPage() {
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);

  const [photos] = useState<(string | null)[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = sessionStorage.getItem("photobooth_photos");
    return stored ? JSON.parse(stored) : [];
  });

  const [config] = useState<{
    size: number;
    columns: number;
    title: string;
  } | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("photobooth_config");
    return stored ? JSON.parse(stored) : null;
  });

  const normalizedTitle = (config?.title || "").trim().toUpperCase();
  const resultTheme =
    normalizedTitle === "ELEVATOR"
      ? "elevator"
      : normalizedTitle === "SUBWAY 2"
        ? "subway"
        : normalizedTitle === "TRANSIT"
          ? "terminal"
          : "default";

  const previewWidthClass = "max-w-6xl";

  const handleDownload = async () => {
    try {
      const dataUrl = await generateResultImage({
        photos,
        config,
        theme: resultTheme,
      });

      const link = document.createElement("a");
      link.download = `snapgrid-${resultTheme}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  return (
    <div className="min-h-screen flex text-gray-100">
      <BokehBackground />

      <main className="relative flex-1 overflow-hidden px-4 py-8 pt-20 sm:px-10 sm:py-10 sm:pt-24 lg:px-16">
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="text-center">
            <StationBadge>Station 03</StationBadge>
            <h1 className="mt-6 flex items-center justify-center gap-2 text-3xl font-extrabold uppercase sm:mt-8 sm:gap-3 sm:text-5xl lg:text-6xl">
              <span className="tracking-tight text-white">Share</span>
              <span className="tracking-tight text-[#FF6B35]">Results</span>
            </h1>
            <p className="mt-3 px-2 text-xs tracking-[0.08em] text-gray-400 sm:text-base sm:tracking-wide">
              Your journey is complete. Download your memories.
            </p>
            <div className="mt-6 flex items-center justify-center">
              <span className="inline-flex items-center justify-center gap-3 rounded-full border border-[#00CED1]/50 bg-[rgba(13,27,42,0.5)] px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#00CED1] sm:gap-4 sm:px-8 sm:py-3 sm:text-[11px] sm:tracking-[0.25em]">
                <span
                  className="h-3 w-3 rounded-full bg-[#00CED1] shadow-[0_0_10px_rgba(0,206,209,0.5)]"
                  aria-hidden
                />
                Journey Completed
              </span>
            </div>
          </div>

          <section className="mt-8 sm:mt-12">
            <div
              id="print-area"
              className={`mx-auto w-full ${previewWidthClass}`}
            >
              <ResultsPreview
                config={config}
                photos={photos}
                previewRef={previewRef}
              />
            </div>
          </section>

          <div className={`mx-auto mt-8 w-full sm:mt-10 ${previewWidthClass}`}>
            <button
              type="button"
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#00CED1] px-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-white shadow-[0_20px_45px_rgba(0,206,209,0.25)] transition hover:bg-[#00b8ba] sm:h-16 sm:text-xs"
              onClick={handleDownload}
            >
              <svg
                className="w-5 h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center sm:mt-12">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-full bg-[#FF6B35] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_20px_45px_rgba(255,107,53,0.45)] transition hover:bg-[#e55a2b] sm:w-auto sm:gap-4 sm:px-14 sm:py-5 sm:text-xs sm:tracking-[0.25em]"
              onClick={() => {
                sessionStorage.removeItem("photobooth_photos");
                sessionStorage.removeItem("photobooth_config");
                router.push("/");
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Start New Journey
            </button>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Bar */}
    </div>
  );
}
