import { DrawContext } from '@/lib/ar/types';
import { applyGlow, removeGlow } from '../utils/gradients';

/**
 * Draw animated LED Crown - multiple LEDs arranged like a crown on forehead
 * Automatically wraps to forehead width
 */
export function drawLED(context: DrawContext) {
    const { ctx, x, y, width, height, colors } = context;

    const time = Date.now();
    const baseHue = (time / 20) % 360; // Color cycle

    ctx.save();
    ctx.translate(x, y);

    // Position directly on forehead (just slightly above anchor point 10)
    ctx.translate(0, -height * 0.25);

    // Crown configuration - 7 LEDs wrapping across forehead
    const ledCount = 7;
    const crownWidth = width * 0.9; // Match forehead width
    const arcHeight = height * 0.08; // Subtle arc curve

    for (let i = 0; i < ledCount; i++) {
        // Position each LED along a subtle arc
        const t = (i / (ledCount - 1)) - 0.5; // -0.5 to 0.5
        const ledX = t * crownWidth;
        const ledY = -Math.abs(t) * arcHeight * 2; // Arc shape (higher in middle)

        // Offset hue for rainbow effect
        const hue = (baseHue + i * 40) % 360;
        const glowIntensity = (Math.sin(time / 200 + i * 0.5) + 1) / 2; // Staggered pulsing

        ctx.save();
        ctx.translate(ledX, ledY);

        // Dynamic Color
        const glowColor = `hsla(${hue}, 100%, 60%, ${0.4 + glowIntensity * 0.4})`;

        // LED body size - proportional to face width (BIGGER)
        const bodyRadius = width * 0.10;

        // Glow effect (stronger)
        applyGlow(ctx, glowColor, 30 + glowIntensity * 20);

        // Main body gradient
        const gradient = ctx.createRadialGradient(0, -bodyRadius / 3, 0, 0, 0, bodyRadius);
        gradient.addColorStop(0, `hsla(${hue}, 100%, 80%, 1)`);
        gradient.addColorStop(0.4, `hsla(${hue}, 100%, 55%, 0.95)`);
        gradient.addColorStop(1, `hsla(${hue}, 100%, 35%, 0.85)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, bodyRadius, 0, Math.PI * 2);
        ctx.fill();

        // Outer Halo glow
        ctx.fillStyle = glowColor;
        ctx.beginPath();
        ctx.arc(0, 0, bodyRadius * 1.8, 0, Math.PI * 2);
        ctx.fill();
        removeGlow(ctx);

        // Sharp Highlight (glossy effect)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.arc(-bodyRadius / 3, -bodyRadius / 3, bodyRadius / 3.5, 0, Math.PI * 2);
        ctx.fill();

        // LED legs (small pins)
        ctx.strokeStyle = '#BBBBBB';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';

        // Left leg
        ctx.beginPath();
        ctx.moveTo(-bodyRadius / 4, bodyRadius * 0.85);
        ctx.lineTo(-bodyRadius / 4, bodyRadius + height * 0.04);
        ctx.stroke();

        // Right leg
        ctx.beginPath();
        ctx.moveTo(bodyRadius / 4, bodyRadius * 0.85);
        ctx.lineTo(bodyRadius / 4, bodyRadius + height * 0.03);
        ctx.stroke();

        ctx.restore();
    }

    ctx.restore();
}
