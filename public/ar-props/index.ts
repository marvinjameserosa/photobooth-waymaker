import { ARProp, DrawContext, PropCategory } from "@/lib/ar/types";
import { drawImageProp } from "./utils/imageProp";

interface ARImageAsset {
  file: string;
  id: string;
  name: string;
  category: PropCategory;
  anchorPoints: number[];
  defaultScale: number;
  maxWidthMultiplier: number;
  maxHeightMultiplier: number;
  offsetYMultiplier: number;
}

const IMAGE_PROPS_DIR = "/ar-props/props";
const IMAGE_FILE_REGEX = /\.(png|jpg|jpeg|webp)$/i;

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toDisplayName(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function classifyAsset(
  file: string,
): Omit<ARImageAsset, "file" | "id" | "name"> {
  const baseName = file.replace(IMAGE_FILE_REGEX, "").toLowerCase();

  if (baseName.includes("sunglass") || baseName.includes("shades")) {
    return {
      category: "sunglasses",
      anchorPoints: [33, 133, 362, 263],
      defaultScale: 1,
      maxWidthMultiplier: 1.7,
      maxHeightMultiplier: 1.0,
      offsetYMultiplier: 0,
    };
  }

  if (baseName.includes("logo") || baseName.includes("wordmark")) {
    return {
      category: "logos",
      anchorPoints: [10, 338, 109],
      defaultScale: 1.2,
      maxWidthMultiplier: 1.8,
      maxHeightMultiplier: 1.2,
      offsetYMultiplier: 0.9,
    };
  }

  if (
    baseName.includes("effect") ||
    baseName.includes("rain") ||
    baseName.includes("cloud")
  ) {
    return {
      category: "effects",
      anchorPoints: [10],
      defaultScale: 1.2,
      maxWidthMultiplier: 2,
      maxHeightMultiplier: 1.6,
      offsetYMultiplier: 0,
    };
  }

  if (
    baseName.includes("component") ||
    baseName.includes("resistor") ||
    baseName.includes("servo")
  ) {
    return {
      category: "components",
      anchorPoints: [1],
      defaultScale: 0.9,
      maxWidthMultiplier: 1.1,
      maxHeightMultiplier: 1.1,
      offsetYMultiplier: 0,
    };
  }

  return {
    category: "hats",
    anchorPoints: [10, 338, 109],
    defaultScale: 1.5,
    maxWidthMultiplier: 1.9,
    maxHeightMultiplier: 1.6,
    offsetYMultiplier: 0.65,
  };
}

function fileToAsset(file: string): ARImageAsset {
  const baseName = file.replace(IMAGE_FILE_REGEX, "");
  const slug = toSlug(baseName);
  const classified = classifyAsset(file);

  return {
    file,
    id: `props-${slug}`,
    name: toDisplayName(baseName),
    ...classified,
  };
}

function createImageDraw(asset: ARImageAsset) {
  const src = `${IMAGE_PROPS_DIR}/${asset.file}`;

  return (context: DrawContext) => {
    drawImageProp(context, {
      src,
      maxWidthMultiplier: asset.maxWidthMultiplier,
      maxHeightMultiplier: asset.maxHeightMultiplier,
      offsetYMultiplier: asset.offsetYMultiplier,
    });
  };
}

export function createARPropsFromFiles(files: string[]): ARProp[] {
  return files
    .filter((file) => IMAGE_FILE_REGEX.test(file))
    .map(fileToAsset)
    .map((asset) => ({
      id: asset.id,
      name: asset.name,
      category: asset.category,
      draw: createImageDraw(asset),
      defaultColors: {
        primary: "#FFFFFF",
        secondary: "#FFFFFF",
      },
      anchorPoints: asset.anchorPoints,
      defaultScale: asset.defaultScale,
      thumbnail: `${IMAGE_PROPS_DIR}/${asset.file}`,
    }));
}

const FALLBACK_PROP_FILES = ["logo.png", "sunglasses.png"];

/**
 * Local fallback while dynamic list is still loading.
 */
export const AR_PROPS: ARProp[] = createARPropsFromFiles(FALLBACK_PROP_FILES);

export async function loadARProps(): Promise<ARProp[]> {
  try {
    const response = await fetch("/api/ar-props", { cache: "no-store" });
    if (!response.ok) {
      return AR_PROPS;
    }

    const data: { files?: string[] } = await response.json();
    const files = Array.isArray(data.files) ? data.files : [];
    const props = createARPropsFromFiles(files);

    return props.length > 0 ? props : AR_PROPS;
  } catch {
    return AR_PROPS;
  }
}

/**
 * Get prop by ID
 */
export function getPropById(id: string): ARProp | undefined {
  return AR_PROPS.find((prop) => prop.id === id);
}

/**
 * Get props by category
 */
export function getPropsByCategory(category: string): ARProp[] {
  return AR_PROPS.filter((prop) => prop.category === category);
}
