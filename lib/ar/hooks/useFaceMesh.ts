"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { FaceLandmarker } from '@mediapipe/tasks-vision';
import { loadFaceMeshModel, disposeFaceMeshModel, FaceLandmarkerResult } from '../models/faceMeshLoader';
import { FacePrediction } from '../types';

// Suppress harmless TensorFlow Lite INFO messages from MediaPipe
if (typeof window !== 'undefined') {
    const originalConsoleError = console.error;
    console.error = (...args: unknown[]) => {
        const message = args[0];
        if (typeof message === 'string' && message.includes('TensorFlow Lite XNNPACK')) {
            return; // Suppress this harmless info message
        }
        originalConsoleError.apply(console, args);
    };
}

export function useFaceMesh(videoElement: HTMLVideoElement | null, isEnabled: boolean = true) {
    const [detector, setDetector] = useState<FaceLandmarker | null>(null);
    const [predictions, setPredictions] = useState<FacePrediction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const animationFrameRef = useRef<number | undefined>(undefined);
    const lastVideoTimeRef = useRef<number>(-1);

    // Load model
    useEffect(() => {
        if (!isEnabled) return;

        let isMounted = true;

        async function initModel() {
            setIsLoading(true);
            setError(null);

            try {
                const loadedDetector = await loadFaceMeshModel();
                if (isMounted) {
                    setDetector(loadedDetector);
                    setIsLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'Failed to load model');
                    setIsLoading(false);
                }
            }
        }

        initModel();

        return () => {
            isMounted = false;
        };
    }, [isEnabled]);

    // Detect faces
    const detectFaces = useCallback(async () => {
        if (!detector || !videoElement || !isEnabled) return;

        try {
            // Only detect if video has new frame
            const currentTime = videoElement.currentTime;
            if (currentTime === lastVideoTimeRef.current) {
                // Continue detection loop
                animationFrameRef.current = requestAnimationFrame(detectFaces);
                return;
            }
            lastVideoTimeRef.current = currentTime;

            // Use MediaPipe's detectForVideo API
            const timestamp = performance.now();
            const results: FaceLandmarkerResult = detector.detectForVideo(videoElement, timestamp);

            // Convert MediaPipe results to FacePrediction format
            if (results.faceLandmarks && results.faceLandmarks.length > 0) {
                const predictions: FacePrediction[] = results.faceLandmarks.map((landmarks, index) => {
                    // Convert normalized coordinates to keypoints format
                    const keypoints = landmarks.map((landmark, idx) => ({
                        x: landmark.x * videoElement.videoWidth,
                        y: landmark.y * videoElement.videoHeight,
                        z: landmark.z || 0,
                        name: `landmark_${idx}`
                    }));

                    // Calculate bounding box from landmarks
                    const xs = keypoints.map(kp => kp.x);
                    const ys = keypoints.map(kp => kp.y);
                    const minX = Math.min(...xs);
                    const minY = Math.min(...ys);
                    const maxX = Math.max(...xs);
                    const maxY = Math.max(...ys);

                    return {
                        keypoints,
                        box: {
                            xMin: minX,
                            yMin: minY,
                            xMax: maxX,
                            yMax: maxY,
                            width: maxX - minX,
                            height: maxY - minY,
                        },
                        score: 0.99, // MediaPipe doesn't provide a single confidence score
                    };
                });

                setPredictions(predictions);
            } else {
                setPredictions([]);
            }
        } catch (err) {
            console.error('Face detection error:', err);
        }

        // Continue detection loop
        animationFrameRef.current = requestAnimationFrame(detectFaces);
    }, [detector, videoElement, isEnabled]);

    // Start/stop detection loop
    useEffect(() => {
        if (detector && videoElement && isEnabled) {
            detectFaces();
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [detector, videoElement, isEnabled, detectFaces]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            // Note: We don't dispose the detector here as it's a singleton
            // It will be reused if the component remounts
        };
    }, []);

    return {
        detector,
        predictions,
        isLoading,
        error,
        faceDetected: predictions.length > 0,
    };
}
