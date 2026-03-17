import { DrawContext } from '@/lib/ar/types';

/**
 * Draw Cloud Data effect - LARGER with GLOWING outline
 */
export function drawCloudData(context: DrawContext) {
    const { ctx, x, y, width, height, colors } = context;
    const time = Date.now();

    ctx.save();
    ctx.translate(x, y);
    ctx.translate(0, -height * 0.9); // Position higher above head

    // Cloud shape - 3X BIGGER
    const cloudWidth = width * 1.5;
    const cloudHeight = height * 0.7;

    // Animated glow intensity
    const glowPulse = (Math.sin(time / 400) + 1) / 2;
    const glowIntensity = 20 + glowPulse * 15;

    // Draw GLOWING OUTLINE first (behind the cloud)
    ctx.strokeStyle = colors.primary || '#00CED1';
    ctx.lineWidth = 4;
    ctx.shadowColor = colors.primary || '#00CED1';
    ctx.shadowBlur = glowIntensity;

    // Draw cloud outline
    ctx.beginPath();
    ctx.arc(-cloudWidth * 0.25, 0, cloudHeight * 0.45, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cloudWidth * 0.25, 0, cloudHeight * 0.45, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -cloudHeight * 0.25, cloudHeight * 0.55, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-cloudWidth * 0.4, cloudHeight * 0.1, cloudHeight * 0.32, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cloudWidth * 0.4, cloudHeight * 0.1, cloudHeight * 0.32, 0, Math.PI * 2);
    ctx.stroke();

    // Draw cloud fill (white with slight transparency)
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';

    ctx.beginPath();
    ctx.arc(-cloudWidth * 0.25, 0, cloudHeight * 0.45, 0, Math.PI * 2);
    ctx.arc(cloudWidth * 0.25, 0, cloudHeight * 0.45, 0, Math.PI * 2);
    ctx.arc(0, -cloudHeight * 0.25, cloudHeight * 0.55, 0, Math.PI * 2);
    ctx.arc(-cloudWidth * 0.4, cloudHeight * 0.1, cloudHeight * 0.32, 0, Math.PI * 2);
    ctx.arc(cloudWidth * 0.4, cloudHeight * 0.1, cloudHeight * 0.32, 0, Math.PI * 2);
    ctx.fill();

    // Data packets (arrows going up to cloud)
    const packetCount = 5;

    for (let i = 0; i < packetCount; i++) {
        const offset = (i / packetCount) * Math.PI * 2;
        const progress = ((time / 1200) + offset) % 1;

        const startY = cloudHeight + height * 0.5;
        const endY = cloudHeight * 0.2;
        const packetY = startY - progress * (startY - endY);

        const spreadX = (i - packetCount / 2 + 0.5) * width * 0.2;
        const alpha = Math.sin(progress * Math.PI);

        if (alpha > 0.1) {
            ctx.fillStyle = `rgba(0, 206, 209, ${alpha})`;
            ctx.shadowColor = colors.primary || '#00CED1';
            ctx.shadowBlur = 15;

            const packetSize = width * 0.05;
            ctx.fillRect(spreadX - packetSize / 2, packetY - packetSize / 2, packetSize, packetSize);

            // Upload arrow
            ctx.strokeStyle = `rgba(0, 206, 209, ${alpha})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(spreadX, packetY - packetSize);
            ctx.lineTo(spreadX, packetY - packetSize * 3);
            ctx.moveTo(spreadX - packetSize * 0.6, packetY - packetSize * 2.5);
            ctx.lineTo(spreadX, packetY - packetSize * 3);
            ctx.lineTo(spreadX + packetSize * 0.6, packetY - packetSize * 2.5);
            ctx.stroke();
        }
    }

    ctx.shadowBlur = 0;

    // WiFi symbol on cloud - BIGGER
    const wifiX = 0;
    const wifiY = -cloudHeight * 0.15;
    ctx.strokeStyle = colors.primary || '#00CED1';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    // WiFi arcs
    for (let i = 1; i <= 3; i++) {
        const radius = i * width * 0.06;
        const pulse = (Math.sin(time / 250 + i) + 1) / 2;
        ctx.globalAlpha = 0.6 + pulse * 0.4;
        ctx.shadowColor = colors.primary || '#00CED1';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(wifiX, wifiY, radius, -Math.PI * 0.75, -Math.PI * 0.25);
        ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    // WiFi dot
    ctx.fillStyle = colors.primary || '#00CED1';
    ctx.shadowColor = colors.primary || '#00CED1';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(wifiX, wifiY, width * 0.025, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}
