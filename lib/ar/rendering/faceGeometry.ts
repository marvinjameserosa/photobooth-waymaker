import { FacePrediction } from '../types';

/**
 * Calculate distance between eyes for scaling props
 */
export function getEyeDistance(landmarks: FacePrediction['keypoints']): number {
    const leftEye = landmarks[33];  // Left eye outer corner
    const rightEye = landmarks[263]; // Right eye outer corner

    if (!leftEye || !rightEye) return 100; // Default fallback

    return Math.sqrt(
        Math.pow(rightEye.x - leftEye.x, 2) +
        Math.pow(rightEye.y - leftEye.y, 2)
    );
}

/**
 * Calculate face rotation angles
 */
export function getFaceAngle(landmarks: FacePrediction['keypoints']): {
    pitch: number;
    yaw: number;
    roll: number
} {
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];

    if (!leftEye || !rightEye) {
        return { pitch: 0, yaw: 0, roll: 0 };
    }

    // Calculate roll (head tilt) from eye positions
    let roll = Math.atan2(
        rightEye.y - leftEye.y,
        rightEye.x - leftEye.x
    );

    // Normalize roll to be "upright" (between -PI/2 and PI/2)
    // This handles cases where the camera feed might be mirrored/unmirrored
    // causing the eye vector to point left (180 degrees) instead of right
    if (Math.abs(roll) > Math.PI / 2) {
        roll += Math.PI;
        // Normalize to -PI to PI
        if (roll > Math.PI) roll -= 2 * Math.PI;
    }

    // Simplified pitch and yaw (would need more landmarks for accuracy)
    return {
        pitch: 0,
        yaw: 0,
        roll,
    };
}

/**
 * Get face bounding box
 */
export function getFaceBounds(landmarks: FacePrediction['keypoints']): {
    x: number;
    y: number;
    width: number;
    height: number;
} {
    if (!landmarks || landmarks.length === 0) {
        return { x: 0, y: 0, width: 0, height: 0 };
    }

    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    landmarks.forEach(point => {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
    });

    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
    };
}

/**
 * Calculate position based on anchor points
 */
export function calculateAnchorPosition(
    landmarks: FacePrediction['keypoints'],
    anchorPoints: number[]
): { x: number; y: number } {
    if (!landmarks || anchorPoints.length === 0) {
        return { x: 0, y: 0 };
    }

    let sumX = 0, sumY = 0;
    let validPoints = 0;

    for (const idx of anchorPoints) {
        const point = landmarks[idx];
        if (point) {
            sumX += point.x;
            sumY += point.y;
            validPoints++;
        }
    }

    if (validPoints === 0) {
        return { x: 0, y: 0 };
    }

    return {
        x: sumX / validPoints,
        y: sumY / validPoints,
    };
}
