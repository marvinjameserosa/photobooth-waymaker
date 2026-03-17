"use client";

/**
 * MediaPipe Face Landmarker using direct MediaPipe SDK
 * Provides all 468 face landmarks for accurate AR prop positioning
 *
 * Uses direct MediaPipe SDK (zero dependencies) instead of TensorFlow wrapper
 */

import {
  FaceLandmarker,
  FilesetResolver,
  FaceLandmarkerResult,
} from "@mediapipe/tasks-vision";

type FaceLandmarkerType = FaceLandmarker;

let faceLandmarker: FaceLandmarkerType | null = null;
let isLoading = false;
let wasmFileset: any = null;
const MAX_TRACKED_FACES = 10;

/**
 * Load the MediaPipe Face Landmarker model
 * Uses direct MediaPipe SDK for real-time face tracking
 */
export async function loadFaceMeshModel(): Promise<FaceLandmarkerType> {
  if (faceLandmarker) {
    // Re-apply options in case the singleton was created with older settings.
    await faceLandmarker.setOptions({ numFaces: MAX_TRACKED_FACES });
    return faceLandmarker;
  }

  if (isLoading) {
    // Wait for the current loading to complete
    while (isLoading) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (faceLandmarker) return faceLandmarker;
  }

  isLoading = true;

  try {
    console.log("🔄 Loading MediaPipe Face Landmarker model...");

    // Load the MediaPipe Vision tasks WASM files
    if (!wasmFileset) {
      console.log("📦 Loading MediaPipe WASM files from CDN...");
      wasmFileset = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
      );
    }

    // Create the Face Landmarker
    faceLandmarker = await FaceLandmarker.createFromOptions(wasmFileset, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numFaces: MAX_TRACKED_FACES,
      minFaceDetectionConfidence: 0.5,
      minFacePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
      outputFaceBlendshapes: false,
      outputFacialTransformationMatrixes: false,
    });

    console.log("✅ MediaPipe Face Landmarker loaded successfully!");
    console.log(
      `📍 Detecting up to ${MAX_TRACKED_FACES} faces with 468 landmarks each`,
    );

    isLoading = false;
    return faceLandmarker;
  } catch (error) {
    isLoading = false;
    console.error("❌ Error loading MediaPipe Face Landmarker:", error);
    throw error;
  }
}

/**
 * Dispose of the model to free memory
 */
export async function disposeFaceMeshModel() {
  if (faceLandmarker) {
    faceLandmarker.close();
    faceLandmarker = null;
    console.log("🗑️ MediaPipe Face Landmarker disposed");
  }
}

/**
 * Get the current face landmarker instance
 */
export function getFaceMeshModel() {
  return faceLandmarker;
}

/**
 * Export the result type for use in other files
 */
export type { FaceLandmarkerResult };
