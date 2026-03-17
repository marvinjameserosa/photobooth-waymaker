import { DrawContext } from '@/lib/ar/types';

/**
 * Draw rainbow-colored resistor
 */
export function drawResistor(context: DrawContext) {
    const { ctx, x, y, width, height, rotation } = context;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    const bodyWidth = width * 0.55;
    const bodyHeight = height * 0.35;
    const legLength = width * 0.22;

    // Resistor body (beige/tan)
    ctx.fillStyle = '#D4A574';
    ctx.strokeStyle = '#A0845A';
    ctx.lineWidth = 2;
    ctx.fillRect(-bodyWidth / 2, -bodyHeight / 2, bodyWidth, bodyHeight);
    ctx.strokeRect(-bodyWidth / 2, -bodyHeight / 2, bodyWidth, bodyHeight);

    // Color bands (rainbow - represents resistance value)
    const colors = [
        '#8B4513', // Brown (1)
        '#FF0000', // Red (2)
        '#FFA500', // Orange (3)
        '#FFD700', // Gold (multiplier)
    ];
    const bandWidth = bodyWidth / 10;
    const bandSpacing = bodyWidth / 6;

    for (let i = 0; i < 4; i++) {
        ctx.fillStyle = colors[i];
        const bandX = -bodyWidth / 2 + bandSpacing + (i * bandSpacing);
        ctx.fillRect(bandX, -bodyHeight / 2, bandWidth, bodyHeight);
    }

    // Legs (wires)
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    // Left leg
    ctx.beginPath();
    ctx.moveTo(-bodyWidth / 2, 0);
    ctx.lineTo(-bodyWidth / 2 - legLength, 0);
    ctx.stroke();

    // Right leg
    ctx.beginPath();
    ctx.moveTo(bodyWidth / 2, 0);
    ctx.lineTo(bodyWidth / 2 + legLength, 0);
    ctx.stroke();

    // Add small shine effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(-bodyWidth / 2, -bodyHeight / 2, bodyWidth, bodyHeight / 4);

    ctx.restore();
}
