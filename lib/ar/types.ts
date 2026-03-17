export interface FacePrediction {
    keypoints: Array<{
        x: number;
        y: number;
        z?: number;
        name?: string;
    }>;
    box: {
        xMin: number;
        yMin: number;
        width: number;
        height: number;
    };
    score: number;
}

export interface DrawContext {
    ctx: CanvasRenderingContext2D;
    x: number;          // Center X position
    y: number;          // Center Y position
    width: number;      // Prop width
    height: number;     // Prop height
    rotation: number;   // Rotation in radians
    scale: number;      // Scale factor
    colors: PropColors; // Customizable colors
    landmarks?: FacePrediction['keypoints']; // Optional access to raw landmarks (needed for debug view)
}

export interface PropColors {
    primary: string;    // Main color (e.g., teal #00CED1)
    secondary: string;  // Accent color (e.g., orange #FF6B35)
    tertiary?: string;  // Optional third color
}

export type PropCategory = 'sunglasses' | 'hats' | 'components' | 'logos' | 'effects';

export interface ARProp {
    id: string;
    name: string;
    category: PropCategory;
    draw: (context: DrawContext) => void;  // Drawing function
    defaultColors: PropColors;
    anchorPoints: number[];  // Face landmark indices
    defaultScale: number;
    thumbnail?: string; // Optional thumbnail for preview
}

export interface ARState {
    isEnabled: boolean;
    selectedProp: ARProp | null;
    propScale: number;
    customColors: PropColors | null;
    isModelLoaded: boolean;
    faceDetected: boolean;
}
