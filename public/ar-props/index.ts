import { ARProp } from '@/lib/ar/types';
import { drawArduinoShadesTeal } from './sunglasses/arduinoShadesTeal';
import { drawArduinoCap } from './hats/arduinoCap';
import { drawRobotHelmet } from './hats/robotHelmet';
import { drawResistor } from './components/resistor';
import { drawServoEars } from './components/servoEars';
import { drawDebugLandmarks } from './debug/faceLandmarks';
import { drawBinaryRain } from './effects/binaryRain';
import { drawCloudData } from './effects/cloudData';

/**
 * Registry of all available AR props
 */
export const AR_PROPS: ARProp[] = [
    // Sunglasses
    {
        id: 'arduino-shades-teal',
        name: 'Arduino Teal Shades',
        category: 'sunglasses',
        draw: drawArduinoShadesTeal,
        defaultColors: {
            primary: '#00CED1',   // Teal
            secondary: '#FF6B35', // Orange
        },
        anchorPoints: [33, 133, 362, 263], // Eyes landmarks
        defaultScale: 1.0, // Reduced further to 1.0 for smaller fit
    },

    // Hats
    {
        id: 'arduino-cap',
        name: 'Arduino Day Cap',
        category: 'hats',
        draw: drawArduinoCap,
        defaultColors: {
            primary: '#00CED1',   // Teal
            secondary: '#FF6B35', // Orange
        },
        anchorPoints: [10, 338, 109], // Forehead landmarks
        defaultScale: 1.6, // Reduced from 2.2
    },

    {
        id: 'robot-helmet',
        name: 'Robot Helmet',
        category: 'hats',
        draw: drawRobotHelmet,
        defaultColors: {
            primary: '#C0C0C0',   // Silver
            secondary: '#00BFFF', // Blue light
        },
        anchorPoints: [10, 338, 109], // Forehead landmarks
        defaultScale: 1.5, // Increased slightly per request
    },

    // Electronic Components

    {
        id: 'resistor-rainbow',
        name: 'Rainbow Resistor',
        category: 'components',
        draw: drawResistor,
        defaultColors: {
            primary: '#D4A574',   // Beige body
            secondary: '#888888', // Gray legs
        },
        anchorPoints: [1], // Nose tip
        defaultScale: 0.5, // Standard size
    },

    {
        id: 'servo-ears',
        name: 'Servo Motor Ears',
        category: 'components',
        draw: drawServoEars,
        defaultColors: {
            primary: '#00CED1',   // Teal accent
            secondary: '#FF6B35', // Orange tip
        },
        anchorPoints: [10, 338, 109], // Head position
        defaultScale: 1.0,
    },

    // Effects
    {
        id: 'binary-rain',
        name: 'Binary Rain',
        category: 'effects',
        draw: drawBinaryRain,
        defaultColors: {
            primary: '#00FF00',   // Matrix green
            secondary: '#003300', // Dark green
        },
        anchorPoints: [10], // Around head
        defaultScale: 1.0,
    },

    {
        id: 'cloud-data',
        name: 'Cloud Data',
        category: 'effects',
        draw: drawCloudData,
        defaultColors: {
            primary: '#00CED1',   // Teal
            secondary: '#FFFFFF', // White cloud
        },
        anchorPoints: [10], // Above head
        defaultScale: 1.0,
    },

    // Debug
    {
        id: 'debug-landmarks',
        name: 'Debug Landmarks',
        category: 'effects',
        draw: drawDebugLandmarks,
        defaultColors: {
            primary: '#00CED1',
            secondary: '#FF6B35',
        },
        anchorPoints: [1], // Will render all landmarks
        defaultScale: 1.0,
    },
];

/**
 * Get prop by ID
 */
export function getPropById(id: string): ARProp | undefined {
    return AR_PROPS.find(prop => prop.id === id);
}

/**
 * Get props by category
 */
export function getPropsByCategory(category: string): ARProp[] {
    return AR_PROPS.filter(prop => prop.category === category);
}
