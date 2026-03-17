"use client";

import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { FacePrediction, ARProp, PropColors } from '@/lib/ar/types';
import { renderProp } from '@/lib/ar/rendering/propRenderer';

interface ARCanvasProps {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    predictions: FacePrediction[];
    selectedProp: ARProp | null;
    propScale?: number;
    customColors?: PropColors | null;
    mirrored?: boolean;
}

const ARCanvas = forwardRef<HTMLCanvasElement, ARCanvasProps>(({
    videoRef,
    predictions,
    selectedProp,
    propScale = 1.0,
    customColors,
    mirrored = false,
}, ref) => {
    const internalRef = useRef<HTMLCanvasElement>(null);

    // Expose internal ref to parent
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useEffect(() => {
        const canvas = internalRef.current;
        const video = videoRef.current;

        if (!canvas || !video) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Match canvas size to video
        canvas.width = video.videoWidth || video.clientWidth;
        canvas.height = video.videoHeight || video.clientHeight;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Render props on each detected face
        if (selectedProp && predictions.length > 0) {
            predictions.forEach(prediction => {
                let keypoints = prediction.keypoints;

                // Flip coordinates if mirrored (to match scaleX(-1) video)
                if (mirrored) {
                    keypoints = keypoints.map(p => ({
                        ...p,
                        x: canvas.width - p.x
                    }));
                }

                renderProp(
                    ctx,
                    selectedProp,
                    keypoints,
                    propScale,
                    customColors || undefined
                );
            });
        }
    }, [videoRef, predictions, selectedProp, propScale, customColors, mirrored]);

    return (
        <canvas
            ref={internalRef}
            className="absolute inset-0 pointer-events-none z-10"
            style={{ width: '100%', height: '100%' }}
        />
    );
});

ARCanvas.displayName = 'ARCanvas';

export default ARCanvas;
