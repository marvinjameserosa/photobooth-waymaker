"use client";

import { ARProp, PropCategory } from '@/lib/ar/types';
import { AR_PROPS } from '@/public/ar-props';
import { useState } from 'react';

interface PropSelectorProps {
    onSelectProp: (prop: ARProp | null) => void;
    selectedProp: ARProp | null;
}

const categories: { id: PropCategory; label: string; icon: string }[] = [
    { id: 'sunglasses', label: 'Sunglasses', icon: '🕶️' },
    { id: 'hats', label: 'Hats', icon: '🧢' },
    { id: 'components', label: 'Components', icon: '⚡' },
    { id: 'logos', label: 'Logos', icon: '🏷️' },
    { id: 'effects', label: 'Effects', icon: '✨' },
];

export default function PropSelector({ onSelectProp, selectedProp }: PropSelectorProps) {
    const [activeCategory, setActiveCategory] = useState<PropCategory>('sunglasses');

    const props = AR_PROPS.filter(prop => prop.category === activeCategory);

    return (
        <div className="bg-[rgba(13,27,42,0.95)] border border-[rgba(0,206,209,0.3)] rounded-lg p-4 backdrop-blur-xl">
            {/* Category Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wider transition
              ${activeCategory === cat.id
                                ? 'bg-[#00CED1] text-white'
                                : 'bg-[rgba(0,206,209,0.1)] text-gray-400 hover:bg-[rgba(0,206,209,0.2)]'
                            }
            `}
                    >
                        <span>{cat.icon}</span>
                        <span className="hidden sm:inline">{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* Props Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {/* None option */}
                <button
                    onClick={() => onSelectProp(null)}
                    className={`
            aspect-square rounded-lg border-2 transition flex items-center justify-center
            ${!selectedProp
                            ? 'border-[#FF6B35] bg-[rgba(255,107,53,0.1)]'
                            : 'border-[rgba(0,206,209,0.3)] bg-[rgba(0,206,209,0.05)] hover:border-[#00CED1]'
                        }
          `}
                >
                    <span className="text-3xl">🚫</span>
                </button>

                {/* Prop options */}
                {props.map(prop => (
                    <button
                        key={prop.id}
                        onClick={() => onSelectProp(prop)}
                        className={`
              aspect-square rounded-lg border-2 transition p-3 flex flex-col items-center justify-center gap-2
              ${selectedProp?.id === prop.id
                                ? 'border-[#FF6B35] bg-[rgba(255,107,53,0.1)]'
                                : 'border-[rgba(0,206,209,0.3)] bg-[rgba(0,206,209,0.05)] hover:border-[#00CED1]'
                            }
            `}
                    >
                        {/* Prop preview (simplified icon) */}
                        <div className="text-2xl">
                            {prop.category === 'sunglasses' && '🕶️'}
                            {prop.category === 'hats' && prop.id.includes('robot-helmet') && '🤖'}
                            {prop.category === 'hats' && prop.id.includes('arduino-cap') && '🧢'}
                            {prop.category === 'components' && prop.id.includes('resistor') && '🔌'}
                            {prop.category === 'components' && prop.id.includes('servo') && '⚙️'}
                            {prop.category === 'effects' && prop.id.includes('binary') && '🔢'}
                            {prop.category === 'effects' && prop.id.includes('cloud') && '☁️'}
                            {prop.category === 'effects' && prop.id.includes('debug') && '✨'}
                        </div>
                        <span className="text-xs text-gray-300 text-center leading-tight">
                            {prop.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
