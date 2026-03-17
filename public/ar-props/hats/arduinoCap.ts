import { DrawContext } from "@/lib/ar/types";
import { drawImageProp } from "../utils/imageProp";

const ARDUINO_CAP_IMAGE_SRC = "/ar-props/images/arduino-cap.png";

/**
 * Draw "Arduino Day" text as a hat prop
 */
export function drawArduinoCap(context: DrawContext) {
  const rendered = drawImageProp(context, {
    src: ARDUINO_CAP_IMAGE_SRC,
    maxWidthMultiplier: 1.7,
    maxHeightMultiplier: 2.1,
    offsetYMultiplier: 0.7,
  });

  if (rendered) {
    return;
  }

  // Fallback while image is missing or loading.
  const { ctx, x, y, width, height, rotation, colors } = context;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  const textBlockHeight = height * 0.8;
  ctx.translate(0, -textBlockHeight * 0.8);

  const textScale = width * 0.003;

  ctx.save();
  ctx.font = `900 ${100 * textScale}px "Inter", "Arial", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 15 * textScale;
  ctx.strokeStyle = "white";
  ctx.lineJoin = "round";
  ctx.strokeText("ARDUINO", 0, -30 * textScale);
  ctx.fillStyle = colors.primary;
  ctx.fillText("ARDUINO", 0, -30 * textScale);
  ctx.restore();

  ctx.save();
  ctx.font = `900 ${100 * textScale}px "Inter", "Arial", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 15 * textScale;
  ctx.strokeStyle = "white";
  ctx.lineJoin = "round";
  ctx.strokeText("DAY", 0, 60 * textScale);
  ctx.fillStyle = colors.secondary;
  ctx.fillText("DAY", 0, 60 * textScale);
  ctx.restore();

  ctx.restore();
}
