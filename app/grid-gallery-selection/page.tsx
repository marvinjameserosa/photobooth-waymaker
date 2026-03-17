"use client";

import React, { useRef, useState } from "react";
import BokehBackground from "@/components/ui/BokehBackground";

import { useRouter } from "next/navigation";

type TapeVariant = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type PhotoCard = {
  id: number;
  src?: string;
  alt: string;
  rotation: number;
  tape: TapeVariant;
  badge: string;
  caption: string;
};

const tapePlacement: Record<TapeVariant, string> = {
  "top-left": "-rotate-[4deg]",
  "top-right": "rotate-[3deg]",
  "bottom-left": "-rotate-[3deg]",
  "bottom-right": "rotate-[2deg]",
};

const tapeVariants: TapeVariant[] = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
];
const rotations = [-2.2, 1.6, -1.4, 2.0, -1.8, 1.2];

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

function Polaroid({ photo }: { photo: PhotoCard }) {
  const hasImage = Boolean(photo.src);
  return (
    <div className="relative flex justify-center">
      <div
        className="relative w-full max-w-md lg:max-w-lg bg-white pb-8 pt-4 px-4 shadow-[0_28px_80px_rgba(0,0,0,0.55)] border border-neutral-200"
        style={{ transform: `rotate(${photo.rotation}deg)` }}
      >
        <div
          className={`absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 w-32 h-6 bg-linear-to-r from-amber-200/80 via-amber-100/90 to-amber-200/80 pointer-events-none select-none ${tapePlacement[photo.tape]}`}
        />

        {hasImage ? (
          <>
            <div className="relative overflow-hidden rounded-sm aspect-3/4 bg-neutral-200">
              <span className="absolute top-3 right-3 z-10 border border-[#00CED1]/80 bg-[rgba(13,27,42,0.85)] text-[#00CED1] text-[10px] font-semibold px-2 py-1 tracking-[0.3em] uppercase rounded">
                {photo.badge}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.alt}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-4 text-center text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              {photo.caption}
            </div>
          </>
        ) : (
          <div className="relative overflow-hidden rounded-sm bg-[rgba(13,27,42,0.9)]">
            <span className="absolute top-3 right-3 z-10 border border-[#00CED1]/80 bg-black/85 text-[#00CED1] text-[10px] font-semibold px-2 py-1 tracking-[0.3em] uppercase rounded">
              {photo.badge}
            </span>
            <div className="flex aspect-3/4 items-center justify-center text-xs font-semibold uppercase tracking-[0.4em] text-gray-500">
              {photo.caption}
            </div>
            <div className="h-10" aria-hidden />
          </div>
        )}
        <div
          className="absolute -bottom-8 left-1/2 h-2 w-12 -translate-x-1/2 bg-[#00CED1]/40 blur-[2px]"
          aria-hidden
        />
      </div>
    </div>
  );
}

function reorderPhotos(
  items: (string | null)[],
  fromIndex: number,
  toIndex: number,
): (string | null)[] {
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

export default function SubwayGallery() {
  const router = useRouter();

  const [photos, setPhotos] = useState<(string | null)[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = sessionStorage.getItem("photobooth_photos");
    return stored ? JSON.parse(stored) : [];
  });

  const dragFromIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const [config] = useState<{
    size: number;
    columns: number;
    title: string;
  } | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("photobooth_config");
    return stored ? JSON.parse(stored) : null;
  });

  const photoCards: PhotoCard[] = photos.map((src, index) => ({
    id: index + 1,
    src: src || undefined,
    alt: src ? `Photo ${index + 1}` : `Empty slot ${index + 1}`,
    rotation: rotations[index % rotations.length],
    tape: tapeVariants[index % tapeVariants.length],
    badge: `#${index + 1}`,
    caption: src
      ? `Photo ${String(index + 1).padStart(2, "0")}`
      : `Slot ${String(index + 1).padStart(2, "0")} Empty`,
  }));

  const handleProceed = () => {
    sessionStorage.setItem("photobooth_photos", JSON.stringify(photos));
    router.push("/grid-results");
  };

  const handleDragStart = (index: number) => {
    dragFromIndexRef.current = index;
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    event.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    const fromIndex = dragFromIndexRef.current;
    setDragOverIndex(null);

    if (fromIndex === null || fromIndex === index) return;

    setPhotos((prev) => reorderPhotos(prev, fromIndex, index));
    dragFromIndexRef.current = null;
  };

  const handleDragEnd = () => {
    dragFromIndexRef.current = null;
    setDragOverIndex(null);
  };

  const handleBack = () => {
    if (config) {
      const id =
        config.title === "SUBWAY 1"
          ? "1"
          : config.title === "SUBWAY 2"
            ? "2"
            : config.title === "ELEVATOR"
              ? "3"
              : config.title === "TRANSIT"
                ? "4"
                : "1";
      router.push(`/capture-photos?station=${id}`);
    } else {
      router.push("/capture-photos?station=1");
    }
  };

  return (
    <div className="min-h-screen flex text-gray-100">
      <BokehBackground />

      <main className="relative flex-1 px-6 py-10 pt-24 sm:px-10 lg:px-16 overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center">
            <StationBadge>Station 03</StationBadge>
            <h1 className="mt-8 flex items-center justify-center gap-3 text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase">
              <span className="tracking-tight text-white">Photo</span>
              <span className="tracking-tight text-[#00CED1]">Gallery</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-gray-400 tracking-wide">
              Review your captured moments before final departure
            </p>
            <p className="mt-2 text-xs text-[#00CED1] uppercase tracking-[0.2em]">
              Drag photos to reorder
            </p>
          </div>

          <section className="mt-12">
            <div className="relative bg-[rgba(13,27,42,0.7)] border border-[rgba(0,206,209,0.2)] px-5 py-8 sm:px-12 sm:py-12 rounded-xl backdrop-blur-sm shadow-[0_50px_120px_rgba(0,0,0,0.65)]">
              <div className="absolute inset-x-10 -top-3 h-px bg-linear-to-r from-transparent via-[#00CED1]/60 to-transparent" />

              {photoCards.length > 0 ? (
                <div
                  className={`grid gap-10 ${config?.columns === 1 ? "grid-cols-1 max-w-md mx-auto" : "grid-cols-1 sm:grid-cols-2"}`}
                >
                  {photoCards.map((photo, index) => (
                    <div
                      key={photo.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(event) => handleDragOver(event, index)}
                      onDrop={() => handleDrop(index)}
                      onDragEnd={handleDragEnd}
                      className={
                        "cursor-move transition " +
                        (dragOverIndex === index
                          ? "scale-[1.02] opacity-80"
                          : "")
                      }
                    >
                      <Polaroid photo={photo} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg">
                    No photos captured yet.
                  </p>
                  <button
                    onClick={handleBack}
                    className="mt-6 px-8 py-3 bg-[#00CED1] text-white rounded-full font-medium hover:bg-[#00b8ba] transition"
                  >
                    Go Back to Capture
                  </button>
                </div>
              )}
            </div>
          </section>

          <div className="mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 sm:gap-6">
            <button
              onClick={handleBack}
              className="flex items-center justify-center gap-4 border border-[rgba(0,206,209,0.5)] bg-[rgba(13,27,42,0.8)] px-10 py-5 text-xs font-semibold uppercase tracking-[0.2em] text-gray-100 rounded-full hover:border-[#00CED1] hover:bg-[rgba(13,27,42,0.9)] transition"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 17l-5-5m0 0l5-5m-5 5h12"
                />
              </svg>
              Back to Capture
            </button>
            <button
              onClick={handleProceed}
              className="flex items-center justify-center gap-4 bg-[#FF6B35] px-10 py-5 text-xs font-semibold uppercase tracking-[0.2em] text-white rounded-full shadow-[0_20px_45px_rgba(255,107,53,0.35)] hover:bg-[#e55a2b] transition"
            >
              Proceed to Results
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Bar */}
    </div>
  );
}
