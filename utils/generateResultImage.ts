export type ResultTheme = "default" | "elevator" | "subway" | "terminal";

interface GenerateImageOptions {
  photos: (string | null)[];
  config: { size: number; columns: number; title: string } | null;
  theme?: ResultTheme;
}

export async function generateResultImage({
  photos,
  config,
  theme = "default",
}: GenerateImageOptions): Promise<string> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  const size = config?.size || 4;
  const columns = config?.columns || 2;
  const rows = Math.ceil(size / columns);

  // --- CONFIGURATION BASED ON THEME ---
  // Default (Subway 1/Grid Results)
  const cellSize = 600;
  const gap = 32;
  const paddingX = 80;
  const headerHeight = 220;
  const footerHeight = 140;
  const bgColor = "#ffffff";
  const textColor = "#0d1b2a";
  const accentColor = "#00CED1";

  // Theme Overrides
  if (theme === "elevator") {
    // Load template
    const templateImg = new window.Image();
    templateImg.crossOrigin = "anonymous";
    templateImg.src = "/template/elevator.png";

    try {
      await new Promise<void>((resolve, reject) => {
        templateImg.onload = () => resolve();
        templateImg.onerror = () =>
          reject(new Error("Failed to load template"));
      });

      canvas.width = templateImg.width;
      canvas.height = templateImg.height;

      // Draw template
      ctx.drawImage(templateImg, 0, 0);

      // Slot coordinates in template space (600x1800), scaled to actual image size.
      const slotLeft = canvas.width * 0.1;
      const slotWidth = canvas.width * 0.8;
      const firstSlotTop = canvas.height * 0.118;
      const slotHeight = canvas.height * 0.152;
      const slotGap = canvas.height * 0.0372;

      for (let i = 0; i < 4; i++) {
        const x = slotLeft;
        const y = firstSlotTop + i * (slotHeight + slotGap);
        const innerX = x;
        const innerY = y;
        const innerWidth = slotWidth;
        const innerHeight = slotHeight;

        // Draw photo
        if (photos[i]) {
          const img = new window.Image();
          img.crossOrigin = "anonymous";
          img.src = photos[i]!;
          await new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });

          // Draw image with object-cover (fill slot)
          const imgAspect = img.width / img.height;
          const areaAspect = innerWidth / innerHeight;

          let drawWidth, drawHeight, offsetX, offsetY;

          if (imgAspect > areaAspect) {
            // Image is wider than area, fit height and crop sides
            drawHeight = innerHeight;
            drawWidth = innerHeight * imgAspect;
            offsetY = 0;
            offsetX = (innerWidth - drawWidth) / 2;
          } else {
            // Image is taller than area, fit width and crop top/bottom
            drawWidth = innerWidth;
            drawHeight = innerWidth / imgAspect;
            offsetX = 0;
            offsetY = (innerHeight - drawHeight) / 2;
          }

          ctx.save();
          ctx.beginPath();
          ctx.rect(innerX, innerY, innerWidth, innerHeight);
          ctx.clip();
          ctx.globalCompositeOperation = "source-over"; // Ensure specific drawing mode
          ctx.drawImage(
            img,
            innerX + offsetX,
            innerY + offsetY,
            drawWidth,
            drawHeight,
          );
          ctx.restore();
        } else {
          // Empty slot
          ctx.fillStyle = "rgba(0,0,0,0.1)";
          ctx.fillRect(innerX, innerY, innerWidth, innerHeight);
        }
      }

      return canvas.toDataURL("image/png");
    } catch (e) {
      console.error("Failed to generate elevator image", e);
      // Fallback to default if template fails
    }
  }

  if (theme === "subway") {
    // Subway 2: Similar to default
  }

  if (theme === "terminal") {
    // Terminal: Dark mode? Or just strict layout?
    // Based on previous code, they all share a very similar "receipt" structure on the DOM.
    // We will stick to the "Receipt" look for the specific canvas implementation
    // but tweak titles/colors if needed.
  }

  const contentHeight = rows * cellSize + (rows - 1) * gap;

  canvas.width = columns * cellSize + (columns - 1) * gap + paddingX * 2;
  canvas.height = headerHeight + contentHeight + footerHeight;

  // 1. Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Header
  // Gradient
  const headerGradient = ctx.createLinearGradient(0, 0, 0, headerHeight);
  headerGradient.addColorStop(0, "rgba(0, 206, 209, 0.1)");
  headerGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = headerGradient;
  ctx.fillRect(0, 0, canvas.width, headerHeight);

  // Text
  ctx.textAlign = "center";
  ctx.fillStyle = textColor;
  ctx.font = "900 72px Arial, sans-serif";
  ctx.fillText("SNAPGRID", canvas.width / 2, 80);

  // Title & Lines
  let titleText = (config?.title || "STATION").toUpperCase();
  if (theme === "elevator") titleText = "ELEVATOR";
  if (theme === "subway") titleText = "SUBWAY 2";
  if (theme === "terminal") titleText = "TRANSIT TERMINAL";

  ctx.font = "bold 28px Arial, sans-serif";
  const titleWidth = ctx.measureText(titleText).width;
  const lineLength = 80;
  const lineGap = 30;
  const titleY = 135;

  ctx.fillText(titleText, canvas.width / 2, titleY + 8);

  ctx.beginPath();
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 3;
  ctx.moveTo(canvas.width / 2 - titleWidth / 2 - lineGap - lineLength, titleY);
  ctx.lineTo(canvas.width / 2 - titleWidth / 2 - lineGap, titleY);
  ctx.moveTo(canvas.width / 2 + titleWidth / 2 + lineGap, titleY);
  ctx.lineTo(canvas.width / 2 + titleWidth / 2 + lineGap + lineLength, titleY);
  ctx.stroke();

  // Date
  const now = new Date();
  const dateStr = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(now);

  ctx.fillStyle = "#525252";
  ctx.font = "20px Arial, sans-serif";
  ctx.fillText(dateStr, canvas.width / 2, 180);

  // Separator
  const separatorY = 210;
  const lineGradient = ctx.createLinearGradient(
    paddingX,
    0,
    canvas.width - paddingX,
    0,
  );
  lineGradient.addColorStop(0, "#00CED1");
  lineGradient.addColorStop(1, "#FF6B35");

  ctx.fillStyle = lineGradient;
  ctx.fillRect(paddingX, separatorY, canvas.width - paddingX * 2, 6);

  // 3. Grid
  const gridStartY = headerHeight + 20;

  for (let i = 0; i < size; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);
    const x = paddingX + col * (cellSize + gap);
    const y = gridStartY + row * (cellSize + gap);

    // Placeholder BG
    ctx.fillStyle = "#0d1b2a";
    ctx.fillRect(x, y, cellSize, cellSize);

    if (photos[i]) {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = photos[i]!;
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });

      // Cover fit logic (simple draw for square cells)
      ctx.drawImage(img, x, y, cellSize, cellSize);
    } else {
      // Empty Slot
      ctx.fillStyle = "rgba(0,206,209,0.1)";
      ctx.fillRect(x, y, cellSize, cellSize);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 24px Arial, sans-serif";
      ctx.fillText(
        `SLOT ${String(i + 1).padStart(2, "0")} EMPTY`,
        x + cellSize / 2,
        y + cellSize / 2,
      );
    }

    // Border Overlay
    ctx.strokeStyle = "rgba(0,206,209,0.3)";
    ctx.lineWidth = 12;
    ctx.strokeRect(x, y, cellSize, cellSize);

    // Badge
    const badgeSize = 50;
    const badgeMargin = 16;
    const badgeX = x + cellSize - badgeSize - badgeMargin;
    const badgeY = y + cellSize - badgeSize - badgeMargin;

    // Badge Color based on theme/index?
    // Elevator uses yellow badge in DOM, Default is teal.
    let badgeBg = "#00CED1";
    let badgeText = "#0d1b2a";

    if (theme === "elevator") {
      badgeBg = "#FACC15"; // Yellow-400
      badgeText = "#000000";
    }

    ctx.fillStyle = badgeBg;
    ctx.fillRect(badgeX, badgeY, badgeSize, badgeSize);

    ctx.strokeStyle = "rgba(13,27,42,0.8)";
    ctx.lineWidth = 3;
    ctx.strokeRect(badgeX, badgeY, badgeSize, badgeSize);

    ctx.fillStyle = badgeText;
    ctx.font = "bold 24px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      (i + 1).toString(),
      badgeX + badgeSize / 2,
      badgeY + badgeSize / 2 + 9,
    );
  }

  // 4. Footer
  const footerStartY = gridStartY + contentHeight + 40;

  ctx.fillStyle = lineGradient;
  ctx.fillRect(paddingX, footerStartY, canvas.width - paddingX * 2, 6);

  ctx.textAlign = "center";
  ctx.fillStyle = textColor;
  ctx.font = "bold 32px Arial, sans-serif";
  ctx.fillText("SNAPGRID.STATION", canvas.width / 2, footerStartY + 60);

  ctx.fillStyle = "#737373";
  ctx.font = "18px Arial, sans-serif";
  ctx.fillText(
    "DIGITAL PHOTOBOOTH EXPERIENCE",
    canvas.width / 2,
    footerStartY + 100,
  );

  return canvas.toDataURL("image/png");
}
