import { DrawContext } from '@/lib/ar/types';

/**
 * Draw "Arduino Day" text as a hat prop
 */
export function drawArduinoCap(context: DrawContext) {
    const { ctx, x, y, width, height, rotation, colors } = context;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // Position adjustments
    // Anchor 10 is top of forehead. 
    // We want the text to sit ON TOP of this anchor.
    // So we move UP (negative Y) by half the text block height + some padding.
    const textBlockHeight = height * 0.8;
    ctx.translate(0, -textBlockHeight * 0.8);

    // Draw Settings
    const textScale = width * 0.003; // Original scale for proper visibility

    // Draw "ARDUINO"
    ctx.save();
    ctx.font = `900 ${100 * textScale}px "Inter", "Arial", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Text Shadow/Outline for visibility
    ctx.lineWidth = 15 * textScale;
    ctx.strokeStyle = 'white';
    ctx.lineJoin = 'round';
    ctx.strokeText('ARDUINO', 0, -30 * textScale);

    // Main Text Color
    ctx.fillStyle = colors.primary; // Teal
    ctx.fillText('ARDUINO', 0, -30 * textScale);
    ctx.restore();

    // Draw "DAY"
    ctx.save();
    ctx.font = `900 ${100 * textScale}px "Inter", "Arial", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Text Shadow/Outline
    ctx.lineWidth = 15 * textScale;
    ctx.strokeStyle = 'white';
    ctx.lineJoin = 'round';
    ctx.strokeText('DAY', 0, 60 * textScale);

    // Main Text Color
    ctx.fillStyle = colors.secondary; // Orange
    ctx.fillText('DAY', 0, 60 * textScale);
    ctx.restore();



    ctx.restore();
}
