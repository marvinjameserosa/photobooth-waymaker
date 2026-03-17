"use client";

import { useRef, useState, useEffect } from 'react';
import ARCanvas from '@/components/ar/ARCanvas';
import PropSelector from '@/components/ar/PropSelector';
import ARControls from '@/components/ar/ARControls';
import { useFaceMesh } from '@/lib/ar/hooks/useFaceMesh';
import { useARState } from '@/lib/ar/hooks/useARState';

export default function ARTestPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);

    // AR State
    const {
        isEnabled,
        selectedProp,
        propScale,
        customColors,
        setIsEnabled,
        setSelectedProp,
        setPropScale,
        setIsModelLoaded,
        setFaceDetected,
    } = useARState();

    // Face Detection
    const { predictions, isLoading, faceDetected, error: detectionError } = useFaceMesh(
        videoRef.current,
        isEnabled
    );

    // Update AR state when face detection changes
    useEffect(() => {
        setIsModelLoaded(!isLoading);
        setFaceDetected(faceDetected);
    }, [isLoading, faceDetected, setIsModelLoaded, setFaceDetected]);

    // Start camera
    useEffect(() => {
        async function startCamera() {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user', width: 1280, height: 720 },
                });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (error) {
                console.error('Camera access error:', error);
                setCameraError(error instanceof Error ? error.message : 'Failed to access camera');
            }
        }

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#070707] text-white p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold mb-2">
                        AR Face <span className="text-[#00CED1]">Filters</span>
                    </h1>
                    <p className="text-gray-400">
                        Arduino Day Philippines 2025 - Powered by TensorFlow.js
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Camera Preview */}
                    <div className="lg:col-span-2">
                        <div className="relative aspect-video bg-black rounded-lg overflow-hidden border-2 border-[rgba(0,206,209,0.3)]">
                            {cameraError ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center p-6">
                                        <p className="text-red-400 mb-2">❌ Camera Error</p>
                                        <p className="text-sm text-gray-400">{cameraError}</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="w-full h-full object-cover"
                                    />

                                    {/* AR Canvas Overlay */}
                                    {isEnabled && (
                                        <ARCanvas
                                            videoRef={videoRef}
                                            predictions={predictions}
                                            selectedProp={selectedProp}
                                            propScale={propScale}
                                            customColors={customColors}
                                        />
                                    )}

                                    {/* Status Indicators */}
                                    <div className="absolute top-4 left-4 space-y-2">
                                        {isEnabled && faceDetected && (
                                            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                                ✓ Face Detected
                                            </div>
                                        )}
                                        {isEnabled && !faceDetected && !isLoading && (
                                            <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                                                ⚠ No Face Detected
                                            </div>
                                        )}
                                        {isLoading && (
                                            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                                ⏳ Loading Model...
                                            </div>
                                        )}
                                    </div>

                                    {/* Prop Info */}
                                    {selectedProp && (
                                        <div className="absolute bottom-4 left-4 bg-[rgba(13,27,42,0.9)] border border-[rgba(0,206,209,0.3)] rounded-lg px-4 py-2">
                                            <p className="text-xs text-gray-400">Active Prop</p>
                                            <p className="text-sm font-bold text-[#00CED1]">{selectedProp.name}</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Instructions */}
                        <div className="mt-4 bg-[rgba(13,27,42,0.95)] border border-[rgba(0,206,209,0.3)] rounded-lg p-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-2">
                                📋 Instructions
                            </h3>
                            <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                                <li>Enable AR using the toggle switch</li>
                                <li>Wait for the face detection model to load</li>
                                <li>Position your face in the camera view</li>
                                <li>Select a prop from the categories below</li>
                                <li>Adjust the prop size using the scale slider</li>
                            </ol>
                        </div>
                    </div>

                    {/* AR Controls Sidebar */}
                    <div className="space-y-4">
                        <ARControls
                            isAREnabled={isEnabled}
                            onToggleAR={() => setIsEnabled(!isEnabled)}
                            propScale={propScale}
                            onScaleChange={setPropScale}
                            isModelLoaded={!isLoading}
                            faceDetected={faceDetected}
                        />

                        {isEnabled && (
                            <PropSelector
                                onSelectProp={setSelectedProp}
                                selectedProp={selectedProp}
                            />
                        )}

                        {/* Debug Info */}
                        {isEnabled && (
                            <div className="bg-[rgba(13,27,42,0.95)] border border-[rgba(0,206,209,0.3)] rounded-lg p-4 text-xs font-mono">
                                <h4 className="text-white font-bold mb-2">🔍 Debug Info</h4>
                                <div className="space-y-1 text-gray-400">
                                    <p>Faces: {predictions.length}</p>
                                    <p>Scale: {(propScale * 100).toFixed(0)}%</p>
                                    <p>Prop: {selectedProp?.id || 'None'}</p>
                                    {detectionError && (
                                        <p className="text-red-400">Error: {detectionError}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
