"use client";

interface ARControlsProps {
    isAREnabled: boolean;
    onToggleAR: () => void;
    propScale: number;
    onScaleChange: (scale: number) => void;
    isModelLoaded: boolean;
    faceDetected: boolean;
}

export default function ARControls({
    isAREnabled,
    onToggleAR,
    propScale,
    onScaleChange,
    isModelLoaded,
    faceDetected,
}: ARControlsProps) {
    return (
        <div className="bg-[rgba(13,27,42,0.95)] border border-[rgba(0,206,209,0.3)] rounded-lg p-4 backdrop-blur-xl">
            {/* AR Toggle */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                        AR Filters
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                        {isModelLoaded ? (
                            faceDetected ? '✅ Face detected' : '⚠️ No face detected'
                        ) : (
                            '⏳ Loading model...'
                        )}
                    </p>
                </div>

                <button
                    onClick={onToggleAR}
                    className={`
            relative inline-flex h-8 w-14 items-center rounded-full transition
            ${isAREnabled ? 'bg-[#00CED1]' : 'bg-gray-600'}
          `}
                >
                    <span
                        className={`
              inline-block h-6 w-6 transform rounded-full bg-white transition
              ${isAREnabled ? 'translate-x-7' : 'translate-x-1'}
            `}
                    />
                </button>
            </div>

            {/* Scale Control */}
            {isAREnabled && (
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                        Prop Size
                    </label>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">Small</span>
                        <input
                            type="range"
                            min="0.5"
                            max="1.5"
                            step="0.1"
                            value={propScale}
                            onChange={(e) => onScaleChange(parseFloat(e.target.value))}
                            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#00CED1]"
                        />
                        <span className="text-xs text-gray-400">Large</span>
                    </div>
                    <div className="text-center text-xs text-[#00CED1] font-mono">
                        {(propScale * 100).toFixed(0)}%
                    </div>
                </div>
            )}
        </div>
    );
}
