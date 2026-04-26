"use client";

import Webcam from "react-webcam";
import { useRef, useCallback, useState } from "react";
import { Camera, Upload, Loader2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Camera viewport */}
      <div className="w-full max-w-[640px] mx-auto aspect-[4/3] rounded-2xl bg-[#0a0a14]/80 border border-white/10 relative overflow-hidden flex items-center justify-center shadow-2xl">

        {/* Live feed or preview */}
        {preview ? (
          <img src={preview} alt="Captured document" className="w-full h-full object-cover" />
        ) : (
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full h-full object-cover"
          />
        )}

        {/* Analyzing overlay */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center text-white z-10"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <Loader2 size={48} className="animate-spin text-[#E91E7B] mb-6" />
                <p className="text-lg font-medium animate-pulse tracking-wide">
                  Analyzing document...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Viewfinder corners */}
        <div className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-white/20 rounded-tl-xl pointer-events-none" />
        <div className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 border-white/20 rounded-tr-xl pointer-events-none" />
        <div className="absolute bottom-6 left-6 w-10 h-10 border-b-2 border-l-2 border-white/20 rounded-bl-xl pointer-events-none" />
        <div className="absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-white/20 rounded-br-xl pointer-events-none" />
      </div>

      {/* Action buttons */}
      <div className="w-full max-w-[640px] grid grid-cols-2 gap-4">
        {preview ? (
          <button
            onClick={handleRetake}
            disabled={isAnalyzing}
            className="col-span-2 flex items-center justify-center gap-2 bg-white hover:bg-gray-100 disabled:opacity-50 text-gray-900 py-4 px-6 rounded-full font-semibold transition-all shadow-lg active:scale-[0.98]"
          >
            <RotateCcw size={20} />
            Retake
          </button>
        ) : (
          <>
            <button
              onClick={handleCapture}
              disabled={isAnalyzing}
              className="flex items-center justify-center gap-2 bg-[#E91E7B] hover:bg-[#d0186c] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-6 rounded-full font-semibold transition-all shadow-lg shadow-[#E91E7B]/20 active:scale-[0.98]"
            >
              <Camera size={20} />
              Take Picture
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 py-4 px-6 rounded-full font-semibold transition-all shadow-lg active:scale-[0.98]"
            >
              <Upload size={20} />
              Upload
            </button>
          </>
        )}
      </div>

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
