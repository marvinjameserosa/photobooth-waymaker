"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';


type Station = {
    id: number;
    title: string;
    subtitle?: string;
};

const stations: Station[] = [
    { id: 1, title: "SUBWAY 1", subtitle: "4-Cut Train Car" },
    { id: 2, title: "SUBWAY 2", subtitle: "Subway Doors" },
    { id: 3, title: "ELEVATOR", subtitle: "Vertical Strip" },
    { id: 4, title: "TRANSIT TERMINAL", subtitle: "Route Maps" },
];

function Button({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                onClick?.();
            }}
            className="text-xs border border-[#00CED1]/50 text-[#00CED1] hover:bg-[#00CED1]/10 hover:border-[#00CED1] px-4 py-2.5 w-full rounded-full transition-all duration-200"
        >
            {children}
        </button>
    );
}

function StationCard({ station, onSelect }: { station: Station; onSelect?: (id: number) => void }) {
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
                            <div key={i} className="aspect-square bg-[rgba(0,206,209,0.1)] border border-[rgba(0,206,209,0.3)] rounded-md" />
                        ))}
                    </div>
                );
            case 2:
                return (
                    <div className="grid grid-cols-3 gap-2 w-full">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="aspect-square bg-[rgba(0,206,209,0.1)] border border-[rgba(0,206,209,0.3)] rounded-md" />
                        ))}
                    </div>
                );
            case 3:
                return (
                    <div className="flex flex-col gap-1 items-center w-full justify-center">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="w-full h-8 sm:h-9 bg-[rgba(0,206,209,0.1)] border border-[rgba(0,206,209,0.3)] rounded-md" />
                        ))}
                    </div>
                );
            default:
                return (
                    <div className="grid grid-cols-2 gap-1 w-full mb-10">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="w-full h-12 sm:h-12 bg-[rgba(0,206,209,0.1)] border border-[rgba(0,206,209,0.3)] rounded-md" />
                        ))}
                    </div>
                );
        }
    };

    return (
        <article className="relative border border-[rgba(0,206,209,0.2)] p-6 sm:p-8 rounded-xl flex flex-col justify-between items-center text-center min-h-[420px] sm:min-h-[480px] md:min-h-[520px] bg-[rgba(13,27,42,0.6)] backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:border-[#00CED1] hover:shadow-[0_10px_40px_rgba(0,206,209,0.15)] hover:z-10">
            <div className="absolute top-3 left-3 text-xs border border-[rgba(0,206,209,0.4)] px-2 py-0.5 rounded-full bg-[rgba(13,27,42,0.8)] text-[#00CED1]">{String(station.id).padStart(2, "0")}</div>
            <div className="absolute top-3 right-3 h-3 w-3 rounded-full bg-[#00CED1] shadow-[0_0_10px_rgba(0,206,209,0.5)]" aria-hidden />

            <div className="pt-4 mb-2 flex flex-col items-center">
                <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-lg bg-[rgba(0,206,209,0.1)] flex items-center justify-center mb-4 border border-[rgba(0,206,209,0.2)]">
                    {renderIcon(station.id)}
                </div>
                <h3 className="text-lg sm:text-2xl text-white font-extrabold mb-1 uppercase tracking-wide">{station.title}</h3>
                {station.subtitle && <p className="text-xs text-gray-400 mb-6">{station.subtitle}</p>}
            </div>

            <div className="flex-1 flex items-center justify-center mb-6 w-full">
                <div className="w-full max-w-40">
                    {renderPreview(station.id)}
                </div>
            </div>

            <div className="w-full mt-6">
                <Button onClick={() => onSelect?.(station.id)}>SELECT LAYOUT</Button>
            </div>
        </article>
    );
}

export default function LayoutsPreview() {
    const router = useRouter();

    return (
        <section id="layouts" className="relative w-full py-24 px-6 md:px-12">
            <div className="relative max-w-6xl mx-auto z-10">
                <div className="text-center mb-16">
                    <span className="text-[#00CED1] font-semibold tracking-widest uppercase text-sm mb-4 block">Select Your Layout</span>
                    <h2 className={`text-4xl sm:text-5xl font-bold text-white mb-6 uppercase`}>
                        Choose Your <span className="text-[#00CED1]">Format</span>
                    </h2>
                    <p className={`text-gray-400 max-w-2xl mx-auto text-lg`}>
                        Select from our variety of photobooth layouts, from classic strips to modern grids.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stations.map((s) => (
                        <StationCard
                            key={s.id}
                            station={s}
                            onSelect={(id) => {
                                router.push(`/capture-photos?station=${id}`);
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
