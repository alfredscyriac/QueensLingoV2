"use client";

import Webcam from "react-webcam";
import { useRef, useCallback, useState } from "react";
import { Camera } from "lucide-react";

const videoConstraints = {
  facingMode: { ideal: "environment" },
};

export function CameraCapture({
  onCapture,
  isAnalyzing,
}: {
  onCapture: (base64: string) => void;
  isAnalyzing: boolean;
}) {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleCapture = useCallback(() => {
    const shot = webcamRef.current?.getScreenshot();
    if (!shot) return;
    setPreview(shot);
    onCapture(shot.split(",")[1]);
  }, [onCapture]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      if (!result) return;
      setPreview(result);
      onCapture(result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => setPreview(null);

  return (
    <div className="space-y-3">
      <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
        {preview ? (
          <img
            src={preview}
            alt="Captured document"
            className="w-full h-full object-cover"
          />
        ) : (
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full h-full object-cover"
          />
        )}

        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <p className="text-white animate-pulse">Analyzing document...</p>
          </div>
        )}
      </div>

      {preview ? (
        <button
          onClick={handleRetake}
          disabled={isAnalyzing}
          className="btn-secondary"
        >
          Retake
        </button>
      ) : (
        <>
          <button
            onClick={handleCapture}
            disabled={isAnalyzing}
            className="btn-primary gap-2"
          >
            {isAnalyzing ? "Analyzing..." : "Capture Document"}
            <Camera className="size-4" />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
            className="btn-secondary"
          >
            Upload Image Instead
          </button>
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />
    </div>
  );
}
