import { DrawContext } from "@/lib/ar/types";

interface DrawImageOptions {
  src: string;
  maxWidthMultiplier?: number;
  maxHeightMultiplier?: number;
  sizeMultiplier?: number;
  offsetYMultiplier?: number;
}

interface ImageBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

const imageCache = new Map<string, HTMLImageElement>();
const DEFAULT_SIZE_MULTIPLIER = 0.6;
const boundsCache = new Map<string, ImageBounds>();

function getImageBounds(image: HTMLImageElement, src: string): ImageBounds {
  const cachedBounds = boundsCache.get(src);
  if (cachedBounds) {
    return cachedBounds;
  }

  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    const fullBounds = {
      x: 0,
      y: 0,
      width: image.naturalWidth,
      height: image.naturalHeight,
    };
    boundsCache.set(src, fullBounds);
    return fullBounds;
  }

  ctx.drawImage(image, 0, 0);
  const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  let minX = canvas.width;
  let minY = canvas.height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const alpha = pixelData[(y * canvas.width + x) * 4 + 3];
      if (alpha > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const bounds =
    maxX >= minX && maxY >= minY
      ? {
          x: minX,
          y: minY,
          width: maxX - minX + 1,
          height: maxY - minY + 1,
        }
      : {
          x: 0,
          y: 0,
          width: image.naturalWidth,
          height: image.naturalHeight,
        };

  boundsCache.set(src, bounds);
  return bounds;
}

function getOrCreateImage(src: string): HTMLImageElement | null {
  // During SSR/build there is no browser Image API.
  if (typeof Image === "undefined") {
    return null;
  }

  const cached = imageCache.get(src);
  if (cached) {
    return cached;
  }

  const image = new Image();
  image.src = src;
  imageCache.set(src, image);

  return image;
}

export function drawImageProp(
  context: DrawContext,
  options: DrawImageOptions,
): boolean {
  const { ctx, x, y, width, height, rotation } = context;
  const {
    src,
    maxWidthMultiplier = 1,
    maxHeightMultiplier = 1,
    sizeMultiplier = DEFAULT_SIZE_MULTIPLIER,
    offsetYMultiplier = 0,
  } = options;

  const image = getOrCreateImage(src);
  if (!image || !image.complete || image.naturalWidth === 0) {
    return false;
  }

  const bounds = getImageBounds(image, src);

  const boxWidth = width * maxWidthMultiplier;
  const boxHeight = height * maxHeightMultiplier;
  const fitScale = Math.min(boxWidth / bounds.width, boxHeight / bounds.height);
  const drawWidth = bounds.width * fitScale * sizeMultiplier;
  const drawHeight = bounds.height * fitScale * sizeMultiplier;
  const offsetY = -drawHeight * offsetYMultiplier;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.drawImage(
    image,
    bounds.x,
    bounds.y,
    bounds.width,
    bounds.height,
    -drawWidth / 2,
    -drawHeight / 2 + offsetY,
    drawWidth,
    drawHeight,
  );
  ctx.restore();

  return true;
}
