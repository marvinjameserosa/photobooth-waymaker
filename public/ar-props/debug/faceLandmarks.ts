import { DrawContext } from '@/lib/ar/types';

/**
 * Debug prop - visualizes face landmarks as dots
 */
export function drawDebugLandmarks(context: DrawContext) {
    const { ctx, landmarks } = context;

    // Use the detailed renderer if landmarks are available
    if (landmarks) {
        renderDebugLandmarks(ctx, landmarks);
    } else {
        // Fallback if no landmarks passed (shouldn't happen with updated renderer)
        const { x, y } = context;
        ctx.save();
        ctx.fillStyle = '#FF6B35';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

/**
 * Special renderer for debug mode - shows all face landmarks
 */
export function renderDebugLandmarks(
    ctx: CanvasRenderingContext2D,
    landmarks: Array<{ x: number; y: number; z?: number }>
) {
    ctx.save();

    // Draw all landmarks as small green dots (like the reference)
    ctx.fillStyle = '#00FF00';
    landmarks.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw key landmark indices with labels matching the reference style
    const keyPoints = [
        { idx: 10, label: '#10 Forehead', color: '#00FF00' }, // Green
        { idx: 1, label: '#1 Nose', color: '#FF0000' },       // Red
        { idx: 152, label: '#152 Chin', color: '#0000FF' },   // Blue
        { idx: 33, label: '#33 L Eye', color: '#FF6B35' },    // Orange
        { idx: 263, label: '#263 R Eye', color: '#FF6B35' },  // Orange
    ];

    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    keyPoints.forEach(({ idx, label, color }) => {
        const point = landmarks[idx];
        if (point) {
            // Draw larger colored dot
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
            ctx.fill();

            // Draw text label to the left/right/top based on position
            ctx.fillStyle = '#FFFFFF';
            // Add a slight shadow for readability
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 4;

            // Adjust label position slightly for clarity
            let labelY = point.y;
            if (idx === 10) labelY -= 15; // Above forehead
            if (idx === 152) labelY += 15; // Below chin
            if (idx === 1) labelY -= 15; // Above nose
            if (idx === 33) labelY -= 15; // Above left eye
            if (idx === 263) labelY -= 15; // Above right eye

            // Draw label text
            ctx.fillText(label, point.x, labelY);

            // Draw the connection if needed (not strictly in reference but helpful)
            // But let's stick closer to the reference which just has the dot and text nearby
        }
    });

    ctx.restore();
}
