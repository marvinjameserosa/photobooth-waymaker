"use client";
import React from "react";
import Image from "next/image";
import BokehBackground from "@/components/ui/BokehBackground";
import { getEnabledStations } from "@/lib/layoutMode";

import { useRouter } from "next/navigation";

type Station = {
  id: number;
  title: string;
  subtitle?: string;
};

const stations: Station[] = getEnabledStations();

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

function Button({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
      }}
      className="text-xs border border-[#00CED1]/50 text-[#00CED1] hover:bg-[#00CED1]/10 hover:border-[#00CED1] px-4 py-2.5 w-full rounded-full transition-all duration-200"
    >
      {children}
    </button>
  );
}

function StationCard({
  station,
  onSelect,
}: {
  station: Station;
  onSelect?: (id: number) => void;
}) {
  const renderIcon = (id: number) => {
    switch (id) {
      case 1:
        return (
          <div className="relative w-[80%] h-[80%]">
            <Image
              src="/icons/Grid%20(gray).png"
              alt="Grid icon"
              fill
              className="object-contain brightness-0 invert opacity-70"
              sizes="(max-width: 640px) 56px, 80px"
            />
          </div>
        );
      case 2:
        return (
          <div className="relative w-[80%] h-[80%]">
            <Image
              src="/icons/door-open.png"
              alt="Grid icon"
              fill
              className="object-contain brightness-0 invert opacity-70"
              sizes="(max-width: 640px) 56px, 80px"
            />
          </div>
        );
      case 3:
        return (
          <div className="relative w-[80%] h-[80%]">
            <Image
              src="/icons/up-down.png"
              alt="Elevator icon"
              fill
              className="object-contain brightness-0 invert opacity-70"
              sizes="(max-width: 640px) 56px, 80px"
            />
          </div>
        );
      default:
        return (
          <div className="relative w-[80%] h-[80%]">
            <Image
              src="/icons/map%20(gray).png"
              alt="Map icon"
              fill
              className="object-contain brightness-0 invert opacity-70"
              sizes="(max-width: 640px) 56px, 80px"
            />
          </div>
        );
    }
  };

  const renderPreview = (id: number) => {
    switch (id) {
      case 1:
        return (
          <div className="grid grid-cols-2 gap-2 w-full">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-[rgba(0,206,209,0.1)] border border-[rgba(0,206,209,0.3)] rounded-md"
              />
            ))}
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-3 gap-2 w-full">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-[rgba(0,206,209,0.1)] border border-[rgba(0,206,209,0.3)] rounded-md"
              />
            ))}
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col gap-1 items-center w-full justify-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-8 sm:h-9 bg-[rgba(0,206,209,0.1)] border border-[rgba(0,206,209,0.3)] rounded-md"
              />
            ))}
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-2 gap-1 w-full mb-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-12 sm:h-12 bg-[rgba(0,206,209,0.1)] border border-[rgba(0,206,209,0.3)] rounded-md"
              />
            ))}
          </div>
        );
    }
  };

  return (
    <article
      onClick={() => onSelect?.(station.id)}
      className="group cursor-pointer relative border border-[rgba(0,206,209,0.2)] p-6 sm:p-8 rounded-xl flex flex-col justify-between items-center text-center min-h-[420px] sm:min-h-[480px] md:min-h-[520px] bg-[rgba(13,27,42,0.6)] backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:border-[#00CED1] hover:shadow-[0_10px_40px_rgba(0,206,209,0.15)] hover:z-10"
    >
      <div className="absolute top-3 left-3 text-xs border border-[rgba(0,206,209,0.4)] px-2 py-0.5 rounded-full bg-[rgba(13,27,42,0.8)] text-[#00CED1]">
        {String(station.id).padStart(2, "0")}
      </div>
      <div
        className="absolute top-3 right-3 h-3 w-3 rounded-full bg-[#00CED1] shadow-[0_0_10px_rgba(0,206,209,0.5)]"
        aria-hidden
      />

      <div className="pt-4 mb-2 flex flex-col items-center">
        <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-lg bg-[rgba(0,206,209,0.1)] flex items-center justify-center mb-4 border border-[rgba(0,206,209,0.2)] group-hover:bg-[rgba(0,206,209,0.2)] transition-colors">
          {renderIcon(station.id)}
        </div>
        <h3 className="text-lg sm:text-2xl text-white font-extrabold mb-1 uppercase tracking-wide">
          {station.title}
        </h3>
        {station.subtitle && (
          <p className="text-xs text-gray-400 mb-6">{station.subtitle}</p>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center mb-6 w-full">
        <div className="w-full max-w-40 transform group-hover:scale-105 transition-transform">
          {renderPreview(station.id)}
        </div>
      </div>

      <div className="w-full mt-6">
        <Button
          onClick={(e) => {
            e?.stopPropagation();
            if (onSelect) onSelect(station.id);
          }}
        >
          SELECT LAYOUT
        </Button>
      </div>
    </article>
  );
}

export default function GridLayout() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex text-gray-100">
      {/* Bokeh Background */}
      <BokehBackground />

      {/* Navigation */}

      {/* Main Content */}
      <main className="relative flex-1 p-6 md:p-12 pt-24">
        <div className="relative max-w-6xl mx-auto z-10">
          <div className="text-center mb-12">
            <StationBadge>STATION 01</StationBadge>
            <h1 className="mt-6 tracking-tight">
              <span className="block text-4xl sm:text-5xl md:text-6xl font-normal leading-none text-white">
                SELECT YOUR
              </span>
              <span className="block text-4xl sm:text-5xl md:text-6xl font-extrabold leading-none text-[#00CED1]">
                LAYOUT
              </span>
            </h1>
            <p className="mt-4 text-gray-400 max-w-md mx-auto">
              Choose your photobooth layout and prepare for departure
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className="h-2.5 w-2.5 rounded-full bg-[#00CED1] shadow-[0_0_10px_rgba(0,206,209,0.5)] inline-block" />
              <span className="text-xs text-[#00CED1] uppercase tracking-widest">
                System Ready
              </span>
            </div>
            <div className="mt-6 text-[#00CED1] text-2xl animate-bounce">▾</div>
          </div>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stations.map((s) => (
              <StationCard
                key={s.id}
                station={s}
                onSelect={(id) => {
                  router.push(`/capture-photos?station=${id}`);
                }}
              />
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
