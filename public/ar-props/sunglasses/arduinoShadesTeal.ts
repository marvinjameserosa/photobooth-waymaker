import { DrawContext } from '@/lib/ar/types';
import { roundRect } from '../utils/shapes';

/**
 * Draw Arduino-themed teal sunglasses with circuit board pattern
 */
export function drawArduinoShadesTeal(context: DrawContext) {
    const { ctx, x, y, width, height, rotation, colors } = context;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // Frame dimensions - use width directly for better control via defaultScale
    const frameWidth = width;
    const frameHeight = height;
    const lensWidth = frameWidth * 0.42; // Slightly wider lenses
    const lensHeight = frameHeight * 0.8;
    const bridgeWidth = frameWidth * 0.16;
    const templeWidth = frameWidth * 0.2;

    // Vertical offset - align bridge exactly with anchor point (nose bridge)
    // Anchor point is average of eyes, so it's roughly the bridge center.
    // We want the bridge of the glasses to be at y=0 relative to anchor.
    const yOffset = 0;

    // Draw left lens frame
    ctx.fillStyle = colors.primary + '40'; // Teal with transparency
    ctx.strokeStyle = colors.secondary; // Orange
    ctx.lineWidth = 4;

    roundRect(ctx, -frameWidth / 2, yOffset - lensHeight / 2, lensWidth, lensHeight, 10);
    ctx.fill();
    ctx.stroke();

    // Draw right lens frame
    roundRect(ctx, frameWidth / 2 - lensWidth, yOffset - lensHeight / 2, lensWidth, lensHeight, 10);
    ctx.fill();
    ctx.stroke();

    // Bridge - Moved to middle (yOffset) as requested
    ctx.beginPath();
    ctx.moveTo(-bridgeWidth / 2, yOffset);
    ctx.quadraticCurveTo(0, yOffset - 5, bridgeWidth / 2, yOffset);
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 4;
    ctx.stroke();

    // Temples (arms) removed per user request
    /*
    // Draw left temple
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-frameWidth / 2, yOffset - lensHeight / 4);
    ctx.lineTo(-frameWidth / 2 - templeWidth, yOffset - lensHeight / 4 + 10);
    ctx.stroke();

    // Draw right temple
    ctx.beginPath();
    ctx.moveTo(frameWidth / 2, yOffset - lensHeight / 4);
    ctx.lineTo(frameWidth / 2 + templeWidth, yOffset - lensHeight / 4 + 10);
    ctx.stroke();
    */

    // Circuit pattern on lenses
    // Circuit pattern on lenses (centered on lens)
    drawCircuitPattern(ctx, -frameWidth / 2 + lensWidth / 2, yOffset, lensWidth * 0.7, lensHeight * 0.5);
    drawCircuitPattern(ctx, frameWidth / 2 - lensWidth / 2, yOffset, lensWidth * 0.7, lensHeight * 0.5);

    ctx.restore();
}

function drawCircuitPattern(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;

    // Vertical lines
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(x - w / 2 + (i * w / 4), y - h / 2);
        ctx.lineTo(x - w / 2 + (i * w / 4), y + h / 2);
        ctx.stroke();
    }

    // Horizontal lines
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(x - w / 2, y - h / 2 + (i * h / 3));
        ctx.lineTo(x + w / 2, y - h / 2 + (i * h / 3));
        ctx.stroke();
    }

    // Small circuit nodes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let i = 0; i < 6; i++) {
        const nodeX = x - w / 2 + Math.random() * w;
        const nodeY = y - h / 2 + Math.random() * h;
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}
