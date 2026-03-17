/**
 * Create a radial gradient for glow effects
 */
export function createRadialGlow(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    innerRadius: number,
    outerRadius: number,
    color: string,
    opacity: number = 1
) {
    const gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);
    return gradient;
}

/**
 * Create a linear gradient
 */
export function createLinearGradient(
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    colorStops: Array<{ offset: number; color: string }>
) {
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    colorStops.forEach(stop => {
        gradient.addColorStop(stop.offset, stop.color);
    });
    return gradient;
}

/**
 * Apply glow effect to context
 */
export function applyGlow(
    ctx: CanvasRenderingContext2D,
    color: string,
    blur: number = 10
) {
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
}

/**
 * Remove glow effect
 */
export function removeGlow(ctx: CanvasRenderingContext2D) {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
}
