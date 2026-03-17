"use client";
import React from "react";
import { DINEng } from '@/lib/fonts';

// This component displays a panel of stickers for selection

export default function StickerPanel({ open, onClose, onSelect }: { open?: boolean; onClose?: () => void; onSelect?: (src: string) => void }) {
  if (!open) return null;

  const stickers = [
    "TRANSIT STICKER (TRAIN).png",
    "TRANSIT STICKER (POINTER).png",
    "TRANSIT STICKER (LOCATION).png",
    "TRANSIT STICKER (POST).png",
    "TRANSIT STICKER (CIRCLE).png",
    "TRANSIT STICKER (TRIANGLE).png",
    "TRANSIT STICKER (SQUARE).png",
    "TRANSIT STICKER (DANGER).png",
    "TRANSIT STICKER (RIGHT ARROW).png",
    "TRANSIT STICKER (LEFT ARROW).png",
    "TRANSIT STICKER (UP ARROW).png",
    "TRANSIT STICKER (DOWN ARROW).png",
  ];

  return (
    <>
    <div className="mt-4 border-t border-[#1e1e1e] pt-3">
          <div className="text-center text-lg uppercase text-cyan-300 py-3 border border-solid border-[#092433] rounded">Select a photo below to add stickers</div>
        </div>

    <div className={`${DINEng.className} mt-4 bg-[#171717] border-2 border-yellow-400 p-4 rounded-md w-full`} role="region" aria-label="Transit stickers">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-yellow-400 font-bold tracking-wider">TRANSIT STICKERS</h3>
        <button onClick={onClose} className="text-gray-300" aria-label="Close stickers">
          <img src="/icons/X.png" alt="close" className="h-4 w-4"/>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {stickers.map((s) => (
          <button
            key={s}
            onClick={() => { onSelect?.(`/icons/${s}`); onClose?.(); }}
            className="bg-[#252525] rounded p-4 flex items-center justify-center hover:bg-[#2c2c2c]"
            aria-label={`Sticker ${s}`}>
            <img src={`/icons/${s}`} alt={s} className="h-8 w-8" />
          </button>
        ))}
      </div>
    </div>
    </>
    
  );
}
