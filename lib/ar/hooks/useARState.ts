"use client";

import { useState, useCallback } from 'react';
import { ARProp, ARState, PropColors } from '../types';

export function useARState() {
    const [state, setState] = useState<ARState>({
        isEnabled: false,
        selectedProp: null,
        propScale: 1.0,
        customColors: null,
        isModelLoaded: false,
        faceDetected: false,
    });

    const setIsEnabled = useCallback((enabled: boolean) => {
        setState(prev => ({ ...prev, isEnabled: enabled }));
    }, []);

    const setSelectedProp = useCallback((prop: ARProp | null) => {
        setState(prev => ({ ...prev, selectedProp: prop }));
    }, []);

    const setPropScale = useCallback((scale: number) => {
        setState(prev => ({ ...prev, propScale: scale }));
    }, []);

    const setCustomColors = useCallback((colors: PropColors | null) => {
        setState(prev => ({ ...prev, customColors: colors }));
    }, []);

    const setIsModelLoaded = useCallback((loaded: boolean) => {
        setState(prev => ({ ...prev, isModelLoaded: loaded }));
    }, []);

    const setFaceDetected = useCallback((detected: boolean) => {
        setState(prev => ({ ...prev, faceDetected: detected }));
    }, []);

    return {
        ...state,
        setIsEnabled,
        setSelectedProp,
        setPropScale,
        setCustomColors,
        setIsModelLoaded,
        setFaceDetected,
    };
}
