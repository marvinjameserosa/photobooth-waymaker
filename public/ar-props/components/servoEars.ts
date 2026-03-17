import { DrawContext } from '@/lib/ar/types';

/**
 * Draw animated Servo Motor Ears
 */
export function drawServoEars(context: DrawContext) {
    const { ctx, x, y, width, height, colors } = context;
    const time = Date.now();

    ctx.save();
    ctx.translate(x, y);

    // Draw both ears
    const earOffsetX = width * 0.55;
    const earOffsetY = -height * 0.15;

    // Smooth oscillation for servo rotation
    const rotationAngle = Math.sin(time / 500) * 0.3; // ±0.3 radians (~17 degrees)

    // Draw left ear
    drawServo(ctx, -earOffsetX, earOffsetY, width, height, -rotationAngle, true, colors);

    // Draw right ear
    drawServo(ctx, earOffsetX, earOffsetY, width, height, rotationAngle, false, colors);

    ctx.restore();
}

function drawServo(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    faceWidth: number,
    faceHeight: number,
    rotation: number,
    isLeft: boolean,
    colors: { primary: string; secondary: string }
) {
    ctx.save();
    ctx.translate(x, y);

    const scale = faceWidth * 0.006; // 2x bigger
    const servoWidth = 40 * scale;
    const servoHeight = 50 * scale;

    // Servo body (gray box)
    ctx.fillStyle = '#4A4A4A';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 5;

    // Main body
    ctx.beginPath();
    ctx.roundRect(-servoWidth / 2, -servoHeight / 2, servoWidth, servoHeight, 4 * scale);
    ctx.fill();

    ctx.shadowBlur = 0;

    // Servo motor cap (top circle)
    ctx.fillStyle = '#5A5A5A';
    ctx.beginPath();
    ctx.arc(0, -servoHeight / 2 - 5 * scale, 12 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Center hub
    ctx.fillStyle = '#6A6A6A';
    ctx.beginPath();
    ctx.arc(0, -servoHeight / 2 - 5 * scale, 6 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Rotating arm (the "ear" part)
    ctx.save();
    ctx.translate(0, -servoHeight / 2 - 5 * scale);
    ctx.rotate(rotation);

    // Ear arm
    const armLength = 35 * scale;
    const armWidth = 15 * scale;
    const direction = isLeft ? -1 : 1;

    // Arm gradient
    const gradient = ctx.createLinearGradient(0, 0, direction * armLength, 0);
    gradient.addColorStop(0, '#888888');
    gradient.addColorStop(0.5, '#AAAAAA');
    gradient.addColorStop(1, colors.primary || '#00CED1');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(
        isLeft ? -armLength : 0,
        -armWidth / 2,
        armLength,
        armWidth,
        [0, armWidth / 2, armWidth / 2, 0]
    );
    ctx.fill();

    // Arm highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(isLeft ? -5 * scale : 5 * scale, -armWidth / 3);
    ctx.lineTo(isLeft ? -armLength + 10 * scale : armLength - 10 * scale, -armWidth / 3);
    ctx.stroke();

    // Tip circle
    ctx.fillStyle = colors.secondary || '#FF6B35';
    ctx.beginPath();
    ctx.arc(isLeft ? -armLength + 5 * scale : armLength - 5 * scale, 0, 6 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Servo mounting holes
    ctx.fillStyle = '#333333';
    const holeY = servoHeight / 2 - 8 * scale;
    ctx.beginPath();
    ctx.arc(-servoWidth / 4, holeY, 3 * scale, 0, Math.PI * 2);
    ctx.arc(servoWidth / 4, holeY, 3 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Label on servo
    ctx.fillStyle = '#CCCCCC';
    ctx.font = `bold ${8 * scale}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('SG90', 0, servoHeight / 4);

    ctx.restore();
}
