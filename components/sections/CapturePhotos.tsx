"use client";
import React, {
  useState,
  useEffect,
  Suspense,
  useRef,
  useCallback,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BokehBackground from "@/components/ui/BokehBackground";
import ARCanvas from "@/components/ar/ARCanvas";
import { useFaceMesh } from "@/lib/ar/hooks/useFaceMesh";
import { useARState } from "@/lib/ar/hooks/useARState";
import { getActiveStationConfig } from "@/lib/layoutMode";
import { AR_PROPS } from "@/public/ar-props";

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

function CameraCapture({
  onCapture,
  onClose,
}: {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const arCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showARMenu, setShowARMenu] = useState(false);

  // AR State
  const {
    isEnabled: isAREnabled,
    selectedProp,
    customColors,
    setIsEnabled: setAREnabled,
    setSelectedProp,
    setIsModelLoaded,
    setFaceDetected,
  } = useARState();

  // Face Detection
  const { predictions, isLoading, faceDetected } = useFaceMesh(
    videoRef.current,
    isAREnabled,
  );

  // Update AR state
  useEffect(() => {
    setIsModelLoaded(!isLoading);
    setFaceDetected(faceDetected);
  }, [isLoading, faceDetected, setIsModelLoaded, setFaceDetected]);

  const handleVideoReady = useCallback(() => {
    setIsStreaming(true);
    setError(null);
  }, []);

  const retryCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      if (videoRef.current) {
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Unable to access camera. Please allow camera permissions.");
      console.error("Camera error:", err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      // Reduce resolution for storage efficiency
      const scale = 0.8;
      canvas.width = video.videoWidth * scale;
      canvas.height = video.videoHeight * scale;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Flip horizontally
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0);

        // Draw AR props if enabled
        if (
          isAREnabled &&
          selectedProp &&
          predictions.length > 0 &&
          arCanvasRef.current
        ) {
          const arCanvas = arCanvasRef.current;
          const arCtx = arCanvas.getContext("2d");
          if (arCtx) {
            // Reset transform for AR overlay
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            // Draw AR canvas content
            ctx.drawImage(arCanvas, 0, 0);
          }
        }

        const imageData = canvas.toDataURL("image/jpeg", 0.9);
        onCapture(imageData);
      }
    }
  }, [onCapture, isAREnabled, selectedProp, predictions]);

  useEffect(() => {
    let mounted = true;

    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (mounted && videoRef.current) {
          streamRef.current = stream;
          videoRef.current.srcObject = stream;
        } else {
          stream.getTracks().forEach((track) => track.stop());
        }
      } catch (err) {
        if (mounted) {
          setError("Unable to access camera. Please allow camera permissions.");
          console.error("Camera error:", err);
        }
      }
    };

    initCamera();

    return () => {
      mounted = false;
      stopCamera();
    };
  }, [stopCamera]);

  const isCapturing = useRef(false);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      if (!isCapturing.current) {
        isCapturing.current = true;
        capturePhoto();
      }
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, capturePhoto]);

  const startCountdown = () => {
    isCapturing.current = false;
    setCountdown(3);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-[rgba(13,27,42,0.95)] rounded-2xl overflow-hidden border border-[rgba(0,206,209,0.3)]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[rgba(0,206,209,0.2)]">
          <h3 className="text-lg font-semibold text-white">Camera Capture</h3>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[rgba(255,107,53,0.2)] text-[#FF6B35] hover:bg-[rgba(255,107,53,0.3)] transition"
          >
            ✕
          </button>
        </div>

        {/* Video Preview */}
        <div className="relative aspect-video bg-black">
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center text-center p-4">
              <div>
                <p className="text-[#FF6B35] mb-4">{error}</p>
                <button
                  onClick={retryCamera}
                  className="px-6 py-2 bg-[#00CED1] text-white rounded-full hover:bg-[#00b8ba] transition"
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
                className="w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />

              {/* AR Canvas Overlay */}
              {isAREnabled && (
                <>
                  <ARCanvas
                    ref={arCanvasRef}
                    videoRef={videoRef}
                    predictions={predictions}
                    selectedProp={selectedProp}
                    propScale={1.5} // Auto-scale modifier if needed, or rely on internal logic
                    customColors={customColors}
                    mirrored={true}
                  />
                </>
              )}

              {/* AR Status Indicator */}
              {isAREnabled && (
                <div className="absolute top-4 left-4 space-y-2">
                  {faceDetected && (
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      Face Detected
                    </div>
                  )}
                  {!faceDetected && !isLoading && (
                    <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                      ⚠ No Face
                    </div>
                  )}
                  {isLoading && (
                    <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      ⏳ Loading...
                    </div>
                  )}
                </div>
              )}

              {/* AR Menu Dropdown - Repositioned to bottom right of video */}
              {showARMenu && (
                <div className="absolute bottom-4 right-4 z-20 w-64 bg-[rgba(13,27,42,0.98)] border border-[rgba(0,206,209,0.3)] rounded-lg p-3 shadow-xl backdrop-blur-xl">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-[rgba(0,206,209,0.2)]">
                    <span className="text-xs font-semibold text-white uppercase">
                      AR Effects
                    </span>
                    <button
                      onClick={() => setShowARMenu(false)}
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      CLOSE
                    </button>
                  </div>

                  {/* Props Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {/* None */}
                    <button
                      onClick={() => {
                        setSelectedProp(null);
                        setAREnabled(false); // Explicitly disable AR when None is selected
                        setShowARMenu(false); // Optional: auto-close
                      }}
                      className={`aspect-square rounded border-2 transition flex items-center justify-center text-lg ${
                        !selectedProp
                          ? "border-[#FF6B35] bg-[rgba(255,107,53,0.1)]"
                          : "border-[rgba(0,206,209,0.3)] hover:border-[#00CED1]"
                      }`}
                      title="No Effect"
                    >
                      🚫
                    </button>

                    {/* Props */}
                    {AR_PROPS.map((prop) => (
                      <button
                        key={prop.id}
                        onClick={() => {
                          setSelectedProp(prop);
                          setAREnabled(true); // Auto-enable AR
                          // setShowARMenu(false); // Keep open to let user try different ones
                        }}
                        className={`aspect-square rounded border-2 transition flex items-center justify-center text-lg ${
                          selectedProp?.id === prop.id
                            ? "border-[#FF6B35] bg-[rgba(255,107,53,0.1)]"
                            : "border-[rgba(0,206,209,0.3)] hover:border-[#00CED1]"
                        }`}
                        title={prop.name}
                      >
                        {prop.category === "sunglasses" && "🕶️"}
                        {prop.category === "hats" &&
                          prop.id === "robot-helmet" &&
                          "🤖"}
                        {prop.category === "hats" &&
                          prop.id !== "robot-helmet" &&
                          "🧢"}
                        {prop.category === "components" &&
                          prop.id.includes("resistor") &&
                          "🔌"}
                        {prop.category === "components" &&
                          prop.id.includes("servo") &&
                          "⚙️"}
                        {prop.category === "effects" &&
                          prop.id.includes("binary") &&
                          "🔢"}
                        {prop.category === "effects" &&
                          prop.id.includes("cloud") &&
                          "☁️"}
                        {prop.category === "effects" &&
                          prop.id.includes("debug") &&
                          "✨"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="text-9xl font-bold text-[#00CED1] animate-pulse">
                    {countdown}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Controls */}
        <div className="p-6 flex items-center justify-center gap-4 border-t border-[rgba(0,206,209,0.2)] bg-[rgba(13,27,42,0.5)]">
          <button
            onClick={startCountdown}
            disabled={!isStreaming || countdown !== null}
            className="px-8 py-3 bg-[#00CED1] text-white rounded-full font-medium hover:bg-[#00b8ba] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,206,209,0.3)]"
          >
            {countdown !== null ? "Taking Photo..." : "Take Photo (3s timer)"}
          </button>

          <button
            onClick={capturePhoto}
            disabled={!isStreaming}
            className="px-8 py-3 bg-[#FF6B35] text-white rounded-full font-medium hover:bg-[#e55a2b] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Instant Capture
          </button>

          {/* New AR Effects Button */}
          <button
            onClick={() => setShowARMenu(!showARMenu)}
            disabled={!isStreaming}
            className={`px-6 py-3 rounded-full font-medium transition flex items-center gap-2 ${
              showARMenu || (isAREnabled && selectedProp)
                ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]"
                : "bg-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.2)]"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
            Effects
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}

function PhotoGrid({
  photos,
  size,
  columns,
  onSelect,
  onRemove,
}: {
  photos: (string | null)[];
  size: number;
  columns: number;
  onSelect: (index: number) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {Array.from({ length: size }).map((_, index) => (
        <div
          key={index}
          className="relative aspect-square bg-[rgba(13,27,42,0.7)] border border-[rgba(0,206,209,0.3)] rounded-lg overflow-hidden group cursor-pointer hover:border-[#00CED1] transition-all"
          onClick={() => onSelect(index)}
        >
          {photos[index] ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photos[index]!}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index);
                }}
                className="absolute top-2 right-2 w-6 h-6 bg-[#FF6B35] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
              >
                ✕
              </button>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <span className="text-2xl mb-1">+</span>
              <span className="text-xs uppercase tracking-wider">
                Slot {index + 1}
              </span>
            </div>
          )}
          <span className="absolute bottom-2 right-2 bg-[rgba(0,206,209,0.8)] text-white text-xs px-2 py-0.5 rounded">
            {index + 1}
          </span>
        </div>
      ))}
    </div>
  );
}

function CapturePhotosContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeConfig = getActiveStationConfig(searchParams.get("station"));

  const [showCamera, setShowCamera] = useState(false);
  const [photos, setPhotos] = useState<(string | null)[]>(() =>
    Array(activeConfig.size).fill(null),
  );
  const [selectedSlot, setSelectedSlot] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraCapture = (imageData: string) => {
    setPhotos((prev) => {
      const newPhotos = [...prev];
      const emptyIndex = newPhotos.findIndex((p) => p === null);
      const targetIndex = emptyIndex !== -1 ? emptyIndex : selectedSlot;
      newPhotos[targetIndex] = imageData;
      return newPhotos;
    });
    setShowCamera(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          // Resize to max 1280 width/height while maintaining aspect ratio
          const maxDim = 1280;
          let width = img.width;
          let height = img.height;

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
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Compress to JPEG 0.7
            const compressedData = canvas.toDataURL("image/jpeg", 0.7);

            setPhotos((prev) => {
              const newPhotos = [...prev];
              const emptyIndex = newPhotos.findIndex((p) => p === null);
              if (emptyIndex !== -1) {
                newPhotos[emptyIndex] = compressedData;
              }
              return newPhotos;
            });
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSlotSelect = (index: number) => {
    setSelectedSlot(index);
    if (!photos[index]) {
      setShowCamera(true);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => {
      const newPhotos = [...prev];
      newPhotos[index] = null;
      return newPhotos;
    });
  };

  const capturedCount = photos.filter((p) => p !== null).length;
  const isComplete = capturedCount === activeConfig.size;

  const handleProceed = () => {
    sessionStorage.setItem("photobooth_photos", JSON.stringify(photos));
    sessionStorage.setItem("photobooth_config", JSON.stringify(activeConfig));
    router.push("/grid-gallery-selection");
  };

  return (
    <div className="min-h-screen flex text-gray-100">
      <BokehBackground />

      <main className="relative flex-1 p-6 md:p-12 pt-24">
        <div className="relative max-w-6xl mx-auto z-10">
          <div className="text-center mb-8">
            <StationBadge>STATION 02</StationBadge>
            <h1 className="mt-6 tracking-tight">
              <span className="block text-4xl md:text-6xl font-normal leading-none text-white">
                CAPTURE
              </span>
              <span className="block text-4xl md:text-6xl font-extrabold leading-none text-[#FF6B35]">
                PHOTOS
              </span>
            </h1>

            <p className="mt-4 text-gray-400 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[rgba(0,206,209,0.5)]" />
              {capturedCount}/{activeConfig.size} PHOTOS CAPTURED
              <span className="h-px w-8 bg-[rgba(0,206,209,0.5)]" />
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Controls */}
            <div className="space-y-6">
              {/* Preview of selected/last photo */}
              <div className="bg-[rgba(13,27,42,0.7)] border border-[rgba(0,206,209,0.2)] rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="aspect-video flex items-center justify-center bg-[rgba(0,0,0,0.3)]">
                  {photos[selectedSlot] ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={photos[selectedSlot]!}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <svg
                        className="w-12 h-12 mb-3 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                        />
                      </svg>
                      <span className="text-sm uppercase tracking-wider">
                        No photo selected
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowCamera(true)}
                  className="flex-1 flex items-center justify-center gap-3 py-4 bg-[#00CED1] text-white rounded-full font-medium hover:bg-[#00b8ba] transition shadow-[0_0_20px_rgba(0,206,209,0.3)]"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                    />
                  </svg>
                  Open Camera
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-3 py-4 bg-transparent border border-[#00CED1] text-[#00CED1] rounded-full font-medium hover:bg-[rgba(0,206,209,0.1)] transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Upload Photos
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {/* Proceed Button */}
              {isComplete && (
                <button
                  onClick={handleProceed}
                  className="w-full py-4 bg-[#FF6B35] text-white rounded-full font-medium hover:bg-[#e55a2b] transition shadow-[0_0_25px_rgba(255,107,53,0.3)] flex items-center justify-center gap-3"
                >
                  Proceed to Gallery
                  <svg
                    className="w-5 h-5"
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
              )}
            </div>

            {/* Right Side - Photo Grid */}
            <div>
              <div className="bg-[rgba(13,27,42,0.5)] border border-[rgba(0,206,209,0.2)] rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[#00CED1]">
                    {activeConfig.title} Layout
                  </h3>
                  <span className="text-xs text-gray-400">
                    {capturedCount}/{activeConfig.size} filled
                  </span>
                </div>
                <PhotoGrid
                  photos={photos}
                  size={activeConfig.size}
                  columns={activeConfig.columns}
                  onSelect={handleSlotSelect}
                  onRemove={handleRemovePhoto}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
}

export default function CapturePhotos() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center text-white">
          Loading Station...
        </div>
      }
    >
      <CapturePhotosContent />
    </Suspense>
  );
}
