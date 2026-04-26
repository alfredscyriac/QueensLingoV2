"use client";

import { Play, Pause } from "lucide-react";
import { useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";

export function AudioPlayer({ audioUrl }: { audioUrl: string }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bars = useMemo(
    () => Array.from({ length: 35 }, () => Math.random() * 70 + 20),
    []
  );

  const toggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setPlaying(false);
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <button
      onClick={toggle}
      className="w-full bg-[#E07A6A] hover:bg-[#d66b5b] transition-colors rounded-[2rem] p-4 flex items-center gap-4 shadow-lg group"
    >
      <div className="flex-shrink-0 text-white ml-2">
        {playing ? (
          <Pause fill="currentColor" size={36} className="group-hover:scale-105 transition-transform" />
        ) : (
          <Play fill="currentColor" size={36} className="group-hover:scale-105 transition-transform" />
        )}
      </div>

      <div className="flex-1 flex items-center justify-between h-12 gap-[3px] overflow-hidden pr-4">
        {bars.map((height, i) => (
          <motion.div
            key={i}
            className="w-1.5 bg-white rounded-full"
            animate={{
              height: playing
                ? [`${height}%`, `${Math.random() * 70 + 20}%`, `${height}%`]
                : `${height}%`,
            }}
            transition={{
              duration: 0.8,
              repeat: playing ? Infinity : 0,
              ease: "easeInOut",
              delay: i * 0.05,
            }}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </button>
  );
}
