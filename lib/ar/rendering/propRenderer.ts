import { ARProp, DrawContext, FacePrediction, PropColors } from '../types';
import { getEyeDistance, getFaceAngle, calculateAnchorPosition } from './faceGeometry';

/**
 * Render an AR prop on the canvas based on face landmarks
 */
export function renderProp(
    ctx: CanvasRenderingContext2D,
    prop: ARProp,
    landmarks: FacePrediction['keypoints'],
    userScale: number = 1.0,
    customColors?: PropColors
) {
    if (!landmarks || landmarks.length === 0) return;

    // Calculate position based on anchor points
    const position = calculateAnchorPosition(landmarks, prop.anchorPoints);

    // Calculate size based on face size (eye distance)
    const faceSize = getEyeDistance(landmarks);
    const propWidth = faceSize * prop.defaultScale * userScale;
    const propHeight = propWidth * 0.6; // Aspect ratio

    // Calculate rotation based on face angle
    const { roll } = getFaceAngle(landmarks);

    // Create drawing context
    const drawContext: DrawContext = {
        ctx,
        x: position.x,
        y: position.y,
        width: propWidth,
        height: propHeight,
        rotation: roll,
        scale: userScale,
        colors: customColors || prop.defaultColors,
        landmarks, // Pass raw landmarks for debug renderer
    };

    // Draw the prop
    try {
        prop.draw(drawContext);
    } catch (error) {
        console.error(`Error drawing prop ${prop.id}:`, error);
    }
}

/**
 * Render multiple props (for multiple faces or multiple props on one face)
 */
export function renderProps(
    ctx: CanvasRenderingContext2D,
    props: ARProp[],
    predictions: FacePrediction[],
    userScale: number = 1.0,
    customColors?: PropColors
) {
    predictions.forEach(prediction => {
        props.forEach(prop => {
            renderProp(ctx, prop, prediction.keypoints, userScale, customColors);
        });
    });
}
