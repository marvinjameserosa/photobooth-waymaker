"use client";
import React from "react";
import { DINEng } from '@/lib/fonts';

type PhotoGridItem = { id?: number; src?: string; label?: string; filled?: boolean };

interface PhotoGridProps {
  size?: number;
  items?: Array<string | PhotoGridItem>;
  title?: string;
  onSelect?: (src: string) => void;
  className?: string;
  columns?: number; // 1. Add this prop
}

export default function PhotoGrid({ 
  size = 4, 
  items, 
  title = 'PHOTO GRID', 
  onSelect, 
  className,
  columns = 2 // 2. Default to 2 columns
}: PhotoGridProps) {
  
  const grid: PhotoGridItem[] = items && items.length > 0
    ? items.map((it, i) => (typeof it === 'string' ? { id: i + 1, src: it } : { id: it.id ?? i + 1, src: it.src, label: it.label, filled: it.filled }))
    : new Array(size).fill(0).map((_, i) => ({ id: i + 1, src: `/images/placeholder-${(i % 4) + 1}.jpg` }));

  const filledCount = grid.filter(g => !!g.src && !g.src.includes('placeholder')).length;

  // 3. Create a map for Safe Tailwind Classes
  const gridColsMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  // 4. Determine the class to use
  // If user passes specific columns, use that. 
  // Otherwise, keep your original logic (1 col for single item, 2 for others)
  const gridClass = columns 
    ? gridColsMap[columns] 
    : (grid.length === 1 ? 'grid-cols-1' : 'grid-cols-2');

  return (
    <aside className={`${DINEng.className} w-full bg-[#0b0b0b] border border-[#222] rounded-md p-4 flex flex-col gap-4 ${className ?? ''}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-yellow-400 font-bold tracking-wider">{title}</h2>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-yellow-400" />
          <div className="text-sm text-gray-400">{filledCount}/{grid.length}</div>
        </div>
      </div>

      {/* 5. Apply the dynamic variable here */}
      <div className={`grid ${gridClass} gap-3`}>
        {grid.map((g) => (
          <button
            key={g.id}
            onClick={() => onSelect?.(g.src ?? '')}
            className="aspect-square bg-[#171717] rounded overflow-hidden border border-[#1b1b1b] relative flex items-center justify-center"
            aria-label={`Select slot ${g.id}`}>
            {g.src && !g.src.includes('placeholder') ? (
              <img src={g.src} alt={`slot-${g.id}`} className="h-full w-full object-cover" />
            ) : (
              <div className="text-center text-gray-400 text-s flex flex-col items-center">
                <img src="/icons/SLOT ICON.png" alt="" className="h-8 w-8"/>
                <div className="font-light text-lg">SLOT {g.id}</div>
                <div className="text-base mt-1">{g.src && !g.src.includes('placeholder') ? 'FILLED' : 'EMPTY'}</div>
              </div>
            )}
            <div className="absolute top-2 right-2 bg-green-400 text-black text-s px-2 py-1 rounded">#{g.id}</div>
          </button>
        ))}
      </div>
    </aside>
  );
}   