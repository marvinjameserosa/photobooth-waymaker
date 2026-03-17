import { DrawContext } from '@/lib/ar/types';

/**
 * Draw Matrix-style Binary Rain with LARGE face/body exclusion
 * Much bigger exclusion zone to ensure face is never covered
 */
export function drawBinaryRain(context: DrawContext) {
    const { ctx, x, y, width, height } = context;
    const time = Date.now();

    ctx.save();

    // Use full canvas dimensions
    const fullWidth = ctx.canvas.width;
    const fullHeight = ctx.canvas.height;

    // LARGE exclusion zone - covers face AND upper body
    // Make it 3x the face dimensions to be safe
    const faceCenterX = x;
    const faceCenterY = y + height * 0.3; // Shift down slightly to cover more body
    const excludeRadiusX = width * 1.0;   // 3x face width total
    const excludeRadiusY = height * 2.0;  // 4x face height total (covers head to chest)

    // Rain configuration
    const columnWidth = 22;
    const columns = Math.ceil(fullWidth / columnWidth) + 2;

    // Binary characters
    const chars = ['0', '1'];

    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.textAlign = 'center';

    for (let col = 0; col < columns; col++) {
        const colX = col * columnWidth;

        // Each column has different speed and offset
        const speed = 0.06 + (col % 5) * 0.02;
        const offset = col * 137;

        // Number of characters in this column
        const charCount = Math.ceil(fullHeight / 18) + 5;

        for (let i = 0; i < charCount; i++) {
            // Calculate Y position with wrapping
            const baseY = ((time * speed + offset + i * 18) % (fullHeight + 200)) - 100;

            // Check if point is inside exclusion ellipse
            const dx = (colX - faceCenterX) / excludeRadiusX;
            const dy = (baseY - faceCenterY) / excludeRadiusY;
            const isInsideExclusion = (dx * dx + dy * dy) <= 1;

            // Skip if inside the exclusion zone
            if (isInsideExclusion) {
                continue;
            }

            // Character selection
            const charIndex = Math.floor((time / 70 + col + i) % 2);
            const char = chars[charIndex];

            // Fade based on trail position
            const trailPosition = i / charCount;
            const fade = Math.max(0, 1 - trailPosition * 1.2);

            // BRIGHT green
            const brightness = 150 + fade * 105;
            ctx.fillStyle = `rgba(0, ${brightness}, 50, ${0.7 + fade * 0.3})`;

            // Glow on leading characters
            if (i < 3) {
                ctx.shadowColor = '#00FF00';
                ctx.shadowBlur = 15;
            } else {
                ctx.shadowBlur = 0;
            }

            ctx.fillText(char, colX, baseY);
        }
    }

    ctx.restore();
}
