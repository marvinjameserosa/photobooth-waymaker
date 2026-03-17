import { DrawContext } from '@/lib/ar/types';

/**
 * Draw a Retro Orange Robot Head based on user reference
 */
export function drawRobotHelmet(context: DrawContext) {
    const { ctx, x, y, width, height, rotation } = context;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // Position adjustments
    // Shift up to sit on the forehead (avoid covering eyes)
    ctx.translate(0, -height * 0.5);

    const helmetScale = 0.8; // Internal scale factor
    const w = width * helmetScale;
    const h = height * 1.5 * helmetScale; // Slightly taller than wide

    // Colors
    const colors = {
        primary: '#D95E32', // Burnt Orange
        primaryLight: '#E57A50', // Lighter Orange for highlight
        visorBg: '#2A2A2A', // Dark Grey/Black
        faceLight: '#66D9EF', // Cyan/Light Blue
        rim: '#B84520', // Darker Orange for outlines/shadows
    };

    // --- Main Helmet Shape ---
    ctx.fillStyle = colors.primary;
    ctx.strokeStyle = colors.rim;
    ctx.lineWidth = 4;

    // Squircle shape for the head
    ctx.beginPath();
    const cornerRadius = w * 0.35;
    ctx.roundRect(-w / 2, -h / 1.8, w, h, cornerRadius);
    ctx.fill();
    ctx.stroke();

    // Helmet Highlight (Top Left)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.ellipse(-w * 0.25, -h * 0.35, w * 0.15, h * 0.08, -Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();

    // --- Visor (Black Screen) ---
    ctx.fillStyle = colors.visorBg;
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;

    const visorW = w * 0.85; // Slightly wider since no ears
    const visorH = h * 0.55;
    const visorY = 0; // Centered vertically in the helmet height we defined

    ctx.beginPath();
    // Visor shape - slightly rounded rectangle
    ctx.roundRect(-visorW / 2, -visorH / 2 + h * 0.05, visorW, visorH, visorW * 0.25);
    ctx.fill();
    ctx.stroke();

    // --- Face Details (Happy Eyes & Mouth) ---
    ctx.fillStyle = colors.faceLight;
    ctx.lineCap = 'round';

    // Eyes (Arc shape or simple circles/ovals)
    const eyeSize = w * 0.12;
    const eyeY = -h * 0.05;
    const eyeX = w * 0.18;

    // Left Eye (Arc upside down)
    drawHappyEye(ctx, -eyeX, eyeY, eyeSize);

    // Right Eye
    drawHappyEye(ctx, eyeX, eyeY, eyeSize);

    // Mouth (Wide smile)
    ctx.strokeStyle = colors.faceLight;
    ctx.lineWidth = w * 0.03;
    ctx.beginPath();
    ctx.arc(0, h * 0.05, w * 0.2, 0.2, Math.PI - 0.2);
    ctx.stroke();

    ctx.restore();
}

function drawHappyEye(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    ctx.save();
    ctx.translate(x, y);

    // Arch shape for happy eye
    ctx.fillStyle = '#66D9EF';
    ctx.beginPath();
    ctx.arc(0, 0, size, Math.PI, 0); // Top half circle
    ctx.fill();

    ctx.restore();
}
