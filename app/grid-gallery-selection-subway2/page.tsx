"use client";

import React, { useEffect, useState } from "react";
import Squares from "@/components/ui/bg-particles";
import { DINEng } from "@/lib/fonts";
import Image from "next/image";



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

const photos: PhotoCard[] = [
	{
		id: 1,
		alt: "Empty slot 1",
		rotation: -2.2,
		tape: "top-left",
		badge: "#1",
		caption: "Slot 01 Empty",
	},
	{
		id: 2,
		alt: "Empty slot 2",
		rotation: 1.6,
		tape: "top-right",
		badge: "#2",
		caption: "Slot 02 Empty",
	},
	{
		id: 3,
		alt: "Empty slot 3",
		rotation: -1.4,
		tape: "bottom-left",
		badge: "#3",
		caption: "Slot 03 Empty",
	},
	{
		id: 4,
		alt: "Empty slot 4",
		rotation: 2.0,
		tape: "bottom-right",
		badge: "#4",
		caption: "Slot 04 Empty",
	},
	{
		id: 5,
		alt: "Empty slot 5",
		rotation: -1.8,
		tape: "top-left",
		badge: "#5",
		caption: "Slot 05 Empty",
	},
	{
		id: 6,
		alt: "Empty slot 6",
		rotation: 1.2,
		tape: "top-right",
		badge: "#6",
		caption: "Slot 06 Empty",
	},
];

const tapePlacement: Record<TapeVariant, string> = {
	"top-left": "-rotate-[4deg]",
	"top-right": "rotate-[3deg]",
	"bottom-left": "-rotate-[3deg]",
	"bottom-right": "rotate-[2deg]",
};

function StationBadge({ children }: { children: React.ReactNode }) {
	return (
		<span className="relative inline-flex items-center justify-center px-10 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-sky-400">
			<span className="absolute inset-0 border border-sky-400/80" aria-hidden />
			<span className="absolute -top-1 -left-1 h-3 w-3 bg-sky-400" aria-hidden />
			<span className="absolute -top-1 -right-1 h-3 w-3 bg-sky-400" aria-hidden />
			<span className="absolute -bottom-1 -left-1 h-3 w-3 bg-sky-400" aria-hidden />
			<span className="absolute -bottom-1 -right-1 h-3 w-3 bg-sky-400" aria-hidden />
			<span className="relative tracking-[0.4em]">{children}</span>
		</span>
	);
}

function Polaroid({ photo }: { photo: PhotoCard }) {
	const hasImage = Boolean(photo.src);
	return (
		<div className="relative flex justify-center">
			<div
				className="relative w-full max-w-xs sm:max-w-sm bg-white pb-6 pt-4 px-4 shadow-[0_28px_80px_rgba(0,0,0,0.55)] border border-neutral-200"
				style={{ transform: `rotate(${photo.rotation}deg)` }}
			>
				<Image
					src="/photo-gallery/WASHI TAPE.png"
					alt=""
					width={160}
					height={45}
					className={`absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 w-36 sm:w-40 pointer-events-none select-none drop-shadow-[0_14px_36px_rgba(0,0,0,0.45)] ${tapePlacement[photo.tape]}`}
					aria-hidden
				/>
				{hasImage ? (
					<>
						<div className="relative overflow-hidden rounded-sm aspect-square bg-neutral-200">
							<span className="absolute top-3 right-3 z-10 border border-yellow-300/80 bg-black/85 text-yellow-300 text-[10px] font-semibold px-2 py-1 tracking-[0.3em] uppercase">
								{photo.badge}
							</span>
							<Image
								src={photo.src!}
								alt={photo.alt}
								fill
								className="object-cover"
							/>
						</div>
					</>
				) : (
					<div className="relative overflow-hidden rounded-sm bg-neutral-900">
						<span className="absolute top-3 right-3 z-10 border border-yellow-300/80 bg-black/85 text-yellow-300 text-[10px] font-semibold px-2 py-1 tracking-[0.3em] uppercase">
							{photo.badge}
						</span>
						<div className="flex aspect-square items-center justify-center text-xs font-semibold uppercase tracking-[0.4em] text-neutral-500">
							{photo.caption}
						</div>
						<div className="h-10" aria-hidden />
					</div>
				)}
				<div className="absolute -bottom-8 left-1/2 h-2 w-12 -translate-x-1/2 bg-yellow-300/70 blur-[2px]" aria-hidden />
			</div>
		</div>
	);
}

export default function SubwayGallery() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isDesktop, setIsDesktop] = useState(true);

	useEffect(() => {
		const handleResize = () => {
			const desktop = window.innerWidth >= 1000;
			setIsDesktop(desktop);
			setIsSidebarOpen(desktop);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		if (!isDesktop) {
			document.body.style.overflow = isSidebarOpen ? "hidden" : "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isSidebarOpen, isDesktop]);

	return (
		<div className="min-h-screen flex bg-[#070707] text-gray-100">
			{!isDesktop && !isSidebarOpen && (
				<button
					aria-label="Open navigation"
					aria-controls="main-navigation"
					aria-expanded={isSidebarOpen}
					onClick={() => setIsSidebarOpen(true)}
					className="fixed top-4 left-4 z-40 p-2"
				>
					<div className="w-8 h-8 flex flex-col items-center justify-center gap-1.5">
						<span className="block h-0.5 w-6 bg-yellow-400" />
						<span className="block h-0.5 w-6 bg-yellow-400" />
						<span className="block h-0.5 w-6 bg-yellow-400" />
					</div>
				</button>
			)}


			<main className="relative flex-1 px-6 py-10 sm:px-10 lg:px-16 overflow-hidden">
				{!isDesktop && isSidebarOpen && (
					<div
						className="fixed inset-0 z-20 bg-black/40"
						onClick={() => setIsSidebarOpen(false)}
					/>
				)}

				<div className="absolute inset-0 pointer-events-none">
					<Squares
						speed={0.6}
						squareSize={52}
						direction="diagonal"
						borderColor="rgba(255,255,255,0.04)"
						hoverFillColor="rgba(255,255,255,0.03)"
					/>
				</div>

				<div className="relative z-10 max-w-6xl mx-auto">
					<div className="text-center">
						<StationBadge>Station 03</StationBadge>
						<h1
							className={`mt-8 flex items-center justify-center gap-2 text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase ${DINEng.className}`}
						>
							<span className="tracking-[0.03em] text-white">Photo</span>
							<span className="tracking-[0.03em] text-sky-400">Gallery</span>
							<span className="text-sky-400 text-4xl sm:text-5xl lg:text-6xl"></span>
						</h1>
						<p
							className="mt-2 text-sm sm:text-base text-gray-400 tracking-widest"
							style={{ fontFamily: "TT Firs Neue Trial Var Roman, sans-serif" }}
						>
							Review your captured moments before final departure
						</p>
					</div>

					<section className="mt-12">
						<div className="relative bg-[#121212] border border-neutral-800/70 px-5 py-8 sm:px-12 sm:py-12 shadow-[0_50px_120px_rgba(0,0,0,0.65)]">
							<div className="absolute inset-x-10 -top-3 h-px bg-linear-to-r from-transparent via-yellow-400/60 to-transparent" />
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
								{photos.map((photo) => (
									<Polaroid key={photo.id} photo={photo} />
								))}
							</div>
						</div>
					</section>

					<div className="mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 sm:gap-6">
						<button className="flex items-center justify-center gap-4 border border-neutral-700 bg-neutral-900/80 px-10 py-5 text-xs font-semibold uppercase tracking-[0.32em] text-gray-100 shadow-[0_18px_40px_rgba(0,0,0,0.45)] hover:border-neutral-500 hover:bg-neutral-900 transition">
							<Image
								src="/photo-gallery/BACK TO CAPTURE ICON.png"
								alt="Back to capture"
								width={16}
								height={16}
								className="h-4 w-4"
							/>
							BACK TO CAPTURE
						</button>
						<button className="flex items-center justify-center gap-4 bg-red-600 px-10 py-5 text-xs font-semibold uppercase tracking-[0.32em] text-white shadow-[0_20px_45px_rgba(220,38,38,0.45)] hover:bg-red-500 transition">
							<Image
								src="/photo-gallery/PROCEED TO RESULTS ICON.png"
								alt="Proceed to results"
								width={16}
								height={16}
								className="h-4 w-4"
							/>
							PROCEED TO RESULTS
						</button>
					</div>
				</div>
			</main>
		</div>
	);
}
