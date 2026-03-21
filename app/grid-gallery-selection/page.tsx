"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import BokehBackground from "@/components/ui/BokehBackground";

import { useRouter } from "next/navigation";

type TapeVariant = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type PhotoCard = {
  id: number;
  src?: string;
  alt: string;
  rotation: number;
  tape: TapeVariant;
  badge: string;
  caption: string;
};

const tapePlacement: Record<TapeVariant, string> = {
  "top-left": "-rotate-[4deg]",
  "top-right": "rotate-[3deg]",
  "bottom-left": "-rotate-[3deg]",
  "bottom-right": "rotate-[2deg]",
};

const tapeVariants: TapeVariant[] = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
];
const rotations = [-2.2, 1.6, -1.4, 2.0, -1.8, 1.2];

function StationBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-flex items-center justify-center px-10 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#00CED1]">
      <span
        className="absolute inset-0 border border-[#00CED1]/60 rounded-lg"
        aria-hidden
      />
      <span
        className="absolute -top-1 -left-1 h-3 w-3 bg-[#00CED1] rounded-sm"
        aria-hidden
      />
      <span
        className="absolute -top-1 -right-1 h-3 w-3 bg-[#00CED1] rounded-sm"
        aria-hidden
      />
      <span
        className="absolute -bottom-1 -left-1 h-3 w-3 bg-[#00CED1] rounded-sm"
        aria-hidden
      />
      <span
        className="absolute -bottom-1 -right-1 h-3 w-3 bg-[#00CED1] rounded-sm"
        aria-hidden
      />
      <span className="relative tracking-[0.3em]">{children}</span>
    </span>
  );
}

function Polaroid({ photo }: { photo: PhotoCard }) {
  const hasImage = Boolean(photo.src);
  return (
    <div className="relative flex justify-center">
      <div
        className="relative w-full max-w-md lg:max-w-lg bg-white pb-8 pt-4 px-4 shadow-[0_28px_80px_rgba(0,0,0,0.55)] border border-neutral-200"
        style={{ transform: `rotate(${photo.rotation}deg)` }}
      >
        <div
          className={`absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 w-32 h-6 bg-linear-to-r from-amber-200/80 via-amber-100/90 to-amber-200/80 pointer-events-none select-none ${tapePlacement[photo.tape]}`}
        />

        {hasImage ? (
          <>
            <div className="relative overflow-hidden rounded-sm aspect-3/4 bg-neutral-200">
              <span className="absolute top-3 right-3 z-10 border border-[#00CED1]/80 bg-[rgba(13,27,42,0.85)] text-[#00CED1] text-[10px] font-semibold px-2 py-1 tracking-[0.3em] uppercase rounded">
                {photo.badge}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.alt}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-4 text-center text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              {photo.caption}
            </div>
          </>
        ) : (
          <div className="relative overflow-hidden rounded-sm bg-[rgba(13,27,42,0.9)]">
            <span className="absolute top-3 right-3 z-10 border border-[#00CED1]/80 bg-black/85 text-[#00CED1] text-[10px] font-semibold px-2 py-1 tracking-[0.3em] uppercase rounded">
              {photo.badge}
            </span>
            <div className="flex aspect-3/4 items-center justify-center text-xs font-semibold uppercase tracking-[0.4em] text-gray-500">
              {photo.caption}
            </div>
            <div className="h-10" aria-hidden />
          </div>
        )}
        <div
          className="absolute -bottom-8 left-1/2 h-2 w-12 -translate-x-1/2 bg-[#00CED1]/40 blur-[2px]"
          aria-hidden
        />
      </div>
    </div>
  );
}

function CameraCaptureModal({
  onCapture,
  onClose,
  remainingSlots = 1,
}: {
  onCapture: (imageData: string, closeCamera?: boolean) => void;
  onClose: () => void;
  remainingSlots?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsUserStart, setNeedsUserStart] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [continuousCount, setContinuousCount] = useState<number | null>(null);
  const [cameraFacingMode, setCameraFacingMode] = useState<
    "user" | "environment"
  >("user");
  const isFrontCamera = cameraFacingMode === "user";

  const getCameraErrorMessage = useCallback((err: unknown) => {
    if (typeof window !== "undefined" && !window.isSecureContext) {
      return "Camera needs HTTPS (or localhost). Open this page in a secure context.";
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      return "This device/browser does not support camera access.";
    }

    if (err instanceof DOMException) {
      if (err.name === "NotAllowedError") {
        return "Camera permission is blocked. Please allow camera access in browser settings.";
      }
      if (err.name === "NotFoundError") {
        return "No camera device was found on this phone.";
      }
      if (err.name === "NotReadableError") {
        return "Camera is already in use by another app.";
      }
      if (err.name === "OverconstrainedError") {
        return "Selected camera mode is not available on this device.";
      }
    }

    return "Unable to access camera. Please allow camera permissions.";
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
    setNeedsUserStart(false);
  }, []);

  const handleVideoReady = useCallback(() => {
    setIsStreaming(true);
    setNeedsUserStart(false);
    setError(null);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setNeedsUserStart(false);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      if (videoRef.current) {
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setNeedsUserStart(false);
        try {
          await videoRef.current.play();
          setIsStreaming(true);
        } catch {
          // Some mobile browsers require a direct user gesture before playback.
          setIsStreaming(false);
          setNeedsUserStart(true);
        }
      }
      setError(null);
    } catch (err) {
      setError(getCameraErrorMessage(err));
      console.error("Camera error:", err);
    }
  }, [cameraFacingMode, getCameraErrorMessage]);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const capturePhoto = useCallback((continuous = false) => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const scale = 0.8;
    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (isFrontCamera) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg", 0.9);
    onCapture(imageData, !continuous);
  }, [onCapture, isFrontCamera]);

  const toggleCameraFacingMode = useCallback(() => {
    setCameraFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    setIsStreaming(false);
    setError(null);
  }, []);

  const isCapturing = useRef(false);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      if (!isCapturing.current) {
        isCapturing.current = true;

        const isContinuous = continuousCount !== null && continuousCount > 1;
        capturePhoto(isContinuous);

        if (isContinuous) {
          setContinuousCount((prev) => (prev !== null ? prev - 1 : null));
          window.setTimeout(() => {
            setCountdown(3);
            isCapturing.current = false;
          }, 1000); // 1-second delay before next countdown starts so user registers flash
        } else {
          setContinuousCount(null);
          setCountdown(null);
          isCapturing.current = false;
        }
      }
      return;
    }

    const timer = window.setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [countdown, capturePhoto, continuousCount]);

  const startContinuousShot = () => {
    if (remainingSlots > 0) {
      isCapturing.current = false;
      setContinuousCount(remainingSlots);
      setCountdown(3);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-4">
      <div className="relative flex h-[calc(100dvh-1rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[rgba(0,206,209,0.3)] bg-[rgba(13,27,42,0.95)] sm:h-[min(44rem,calc(100dvh-2rem))]">
        <div className="flex items-center justify-between border-b border-[rgba(0,206,209,0.2)] px-4 py-3 sm:p-4">
          <h3 className="text-lg font-semibold text-white">Take Picture</h3>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(255,107,53,0.2)] text-[#FF6B35] transition hover:bg-[rgba(255,107,53,0.3)]"
          >
            x
          </button>
        </div>

        <div className="relative min-h-0 flex-1 bg-black">
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
              <div>
                <p className="mb-4 text-[#FF6B35]">{error}</p>
                <button
                  onClick={startCamera}
                  className="rounded-full bg-[#00CED1] px-6 py-2 text-white transition hover:bg-[#00b8ba]"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedMetadata={handleVideoReady}
                onCanPlay={handleVideoReady}
                onPlaying={handleVideoReady}
                className="h-full w-full object-cover"
                style={{ transform: isFrontCamera ? "scaleX(-1)" : "none" }}
              />

              {!isStreaming && needsUserStart && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/45 p-4">
                  <button
                    onClick={startCamera}
                    className="rounded-full border border-[#00CED1]/60 bg-[rgba(13,27,42,0.88)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#00CED1] transition hover:bg-[rgba(13,27,42,0.96)]"
                  >
                    Tap to Start Camera
                  </button>
                </div>
              )}

              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="animate-pulse text-6xl font-bold text-[#00CED1] sm:text-9xl">
                    {countdown}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex w-full flex-col items-stretch justify-center gap-3 border-t border-[rgba(0,206,209,0.2)] bg-[rgba(13,27,42,0.5)] p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-6 lg:flex-wrap">
          <button
            onClick={startContinuousShot}
            disabled={!isStreaming || countdown !== null}
            className="w-full rounded-full bg-purple-600 px-4 py-3 text-[13px] font-medium text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-6 sm:text-sm"
          >
            {continuousCount !== null
              ? `Burst (${continuousCount} left)`
              : "Continuous Shot"}
          </button>

          <button
            onClick={() => {
              isCapturing.current = false;
              setContinuousCount(null);
              setCountdown(3);
            }}
            disabled={!isStreaming || countdown !== null}
            className="w-full rounded-full bg-[#00CED1] px-4 py-3 text-[13px] font-medium text-white shadow-[0_0_20px_rgba(0,206,209,0.3)] transition hover:bg-[#00b8ba] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-6 sm:text-sm"
          >
            {countdown !== null && continuousCount === null ? "Taking Photo..." : "Take Photo (3s)"}
          </button>

          <button
            onClick={() => capturePhoto(false)}
            disabled={!isStreaming}
            className="w-full rounded-full bg-[#FF6B35] px-4 py-3 text-[13px] font-medium text-white transition hover:bg-[#e55a2b] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-6 sm:text-sm"
          >
            Instant Capture
          </button>

          <button
            onClick={toggleCameraFacingMode}
            disabled={countdown !== null}
            className="w-full rounded-full border border-[rgba(0,206,209,0.45)] bg-[rgba(13,27,42,0.8)] px-4 py-3 text-sm font-medium text-[#00CED1] transition hover:border-[#00CED1] hover:bg-[rgba(13,27,42,0.95)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-6 sm:text-base"
          >
            {isFrontCamera ? "Back Cam" : "Front Cam"}
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}

function reorderPhotos(
  items: (string | null)[],
  fromIndex: number,
  toIndex: number,
): (string | null)[] {
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

export default function SubwayGallery() {
  const router = useRouter();

  const [photos, setPhotos] = useState<(string | null)[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = sessionStorage.getItem("photobooth_photos");
    return stored ? JSON.parse(stored) : [];
  });

  const dragFromIndexRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);

  const [config] = useState<{
    size: number;
    columns: number;
    title: string;
  } | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("photobooth_config");
    return stored ? JSON.parse(stored) : null;
  });

  const photoCards: PhotoCard[] = photos.map((src, index) => ({
    id: index + 1,
    src: src || undefined,
    alt: src ? `Photo ${index + 1}` : `Empty slot ${index + 1}`,
    rotation: rotations[index % rotations.length],
    tape: tapeVariants[index % tapeVariants.length],
    badge: `#${index + 1}`,
    caption: src
      ? `Photo ${String(index + 1).padStart(2, "0")}`
      : `Slot ${String(index + 1).padStart(2, "0")} Empty`,
  }));

  const handleProceed = () => {
    sessionStorage.setItem("photobooth_photos", JSON.stringify(photos));
    router.push("/grid-results");
  };

  const handleDragStart = (index: number) => {
    dragFromIndexRef.current = index;
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    event.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    const fromIndex = dragFromIndexRef.current;
    setDragOverIndex(null);

    if (fromIndex === null || fromIndex === index) return;

    setPhotos((prev) => reorderPhotos(prev, fromIndex, index));
    dragFromIndexRef.current = null;
  };

  const handleDragEnd = () => {
    dragFromIndexRef.current = null;
    setDragOverIndex(null);
  };

  const handleReplaceRequest = (index: number) => {
    setReplaceIndex(index);
    fileInputRef.current?.click();
  };

  const handleTakePhotoRequest = (index: number) => {
    setReplaceIndex(index);
    setShowCameraModal(true);
  };

  const handleCameraCapture = (imageData: string, closeCamera = true) => {
    let nextIndex = replaceIndex;

    setPhotos((prev) => {
      const next = [...prev];
      if (nextIndex !== null) {
        next[nextIndex] = imageData;
        // Move to next empty slot or next slot for continuous
        if (!closeCamera) {
          const emptyIndex = next.findIndex((p, i) => p === null && i > nextIndex!);
          if (emptyIndex !== -1) {
            nextIndex = emptyIndex;
          } else {
            const anyEmpty = next.findIndex(p => p === null);
            if (anyEmpty !== -1) nextIndex = anyEmpty;
            else nextIndex = (nextIndex! + 1) % config!.size;
          }
          setReplaceIndex(nextIndex);
        }
      }
      sessionStorage.setItem("photobooth_photos", JSON.stringify(next));
      return next;
    });

    if (closeCamera) {
      setShowCameraModal(false);
      setReplaceIndex(null);
    }
  };

  const handleReplacePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || replaceIndex === null) return;

    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 1280;
        let width = image.width;
        let height = image.height;

        if (width > height && width > maxDim) {
          height = (height * maxDim) / width;
          width = maxDim;
        } else if (height > maxDim) {
          width = (width * maxDim) / height;
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(image, 0, 0, width, height);
        const compressedData = canvas.toDataURL("image/jpeg", 0.85);

        setPhotos((prev) => {
          const next = [...prev];
          next[replaceIndex] = compressedData;
          sessionStorage.setItem("photobooth_photos", JSON.stringify(next));
          return next;
        });
      };
      image.src = String(reader.result);
    };

    reader.readAsDataURL(file);
    event.target.value = "";
    setReplaceIndex(null);
  };

  const handleBack = () => {
    router.push("/capture-photos?station=3");
  };

  return (
    <div className="min-h-screen flex text-gray-100">
      <BokehBackground />

      <main className="relative flex-1 overflow-hidden px-4 py-8 pt-20 sm:px-10 sm:py-10 sm:pt-24 lg:px-16">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleReplacePhoto}
        />

        {showCameraModal && (
          <CameraCaptureModal
            onCapture={handleCameraCapture}
            onClose={() => {
              setShowCameraModal(false);
              setReplaceIndex(null);
            }}
            remainingSlots={Math.max(1, photos.filter(p => !p).length || config?.size || 1)}
          />
        )}

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="text-center">
            <StationBadge>Station 02</StationBadge>
            <h1 className="mt-6 flex items-center justify-center gap-2 text-3xl font-extrabold uppercase sm:mt-8 sm:gap-3 sm:text-5xl lg:text-6xl">
              <span className="tracking-tight text-white">Photo</span>
              <span className="tracking-tight text-[#00CED1]">Gallery</span>
            </h1>
            <p className="mt-3 px-2 text-xs tracking-[0.08em] text-gray-400 sm:text-base sm:tracking-wide">
              Review your captured moments before final departure
            </p>
            <p className="mt-2 text-xs text-[#00CED1] uppercase tracking-[0.2em]">
              Drag photos to reorder
            </p>
          </div>

          <section className="mt-8 sm:mt-12">
            <div className="relative rounded-xl border border-[rgba(0,206,209,0.2)] bg-[rgba(13,27,42,0.7)] px-4 py-6 backdrop-blur-sm shadow-[0_50px_120px_rgba(0,0,0,0.65)] sm:px-12 sm:py-12">
              <div className="absolute inset-x-10 -top-3 h-px bg-linear-to-r from-transparent via-[#00CED1]/60 to-transparent" />

              {photoCards.length > 0 ? (
                <div
                  className={`grid gap-6 sm:gap-10 ${config?.columns === 1 ? "mx-auto grid-cols-1 max-w-md" : "grid-cols-1 sm:grid-cols-2"}`}
                >
                  {photoCards.map((photo, index) => (
                    <div
                      key={photo.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(event) => handleDragOver(event, index)}
                      onDrop={() => handleDrop(index)}
                      onDragEnd={handleDragEnd}
                      className={
                        "cursor-move transition " +
                        (dragOverIndex === index
                          ? "scale-[1.02] opacity-80"
                          : "")
                      }
                    >
                      <Polaroid photo={photo} />
                      <div className="mt-4 flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleReplaceRequest(index);
                          }}
                          className="w-full rounded-full border border-[rgba(0,206,209,0.45)] bg-[rgba(13,27,42,0.8)] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#00CED1] transition hover:border-[#00CED1] hover:bg-[rgba(13,27,42,0.95)] sm:w-auto"
                        >
                          {photo.src ? "Replace Photo" : "Add Photo"}
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleTakePhotoRequest(index);
                          }}
                          className="w-full rounded-full border border-[#FF6B35]/50 bg-[#FF6B35]/15 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#FF6B35] transition hover:border-[#FF6B35] hover:bg-[#FF6B35]/25 sm:w-auto"
                        >
                          Take Photo
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg">
                    No photos captured yet.
                  </p>
                  <button
                    onClick={handleBack}
                    className="mt-6 px-8 py-3 bg-[#00CED1] text-white rounded-full font-medium hover:bg-[#00b8ba] transition"
                  >
                    Go Back to Capture
                  </button>
                </div>
              )}
            </div>
          </section>

          <div className="mt-8 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
            <button
              onClick={handleBack}
              className="flex w-full items-center justify-center gap-4 rounded-full border border-[rgba(0,206,209,0.5)] bg-[rgba(13,27,42,0.8)] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-100 transition hover:border-[#00CED1] hover:bg-[rgba(13,27,42,0.9)] sm:w-auto sm:px-10 sm:py-5 sm:text-xs sm:tracking-[0.2em]"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 17l-5-5m0 0l5-5m-5 5h12"
                />
              </svg>
              Back to Capture
            </button>
            <button
              onClick={handleProceed}
              className="flex w-full items-center justify-center gap-4 rounded-full bg-[#FF6B35] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_20px_45px_rgba(255,107,53,0.35)] transition hover:bg-[#e55a2b] sm:w-auto sm:px-10 sm:py-5 sm:text-xs sm:tracking-[0.2em]"
            >
              Proceed to Results
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Bar */}
    </div>
  );
}
