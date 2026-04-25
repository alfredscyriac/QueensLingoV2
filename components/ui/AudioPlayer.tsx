"use client";


import { Volume2, Square } from "lucide-react";
import { useState, useRef } from "react";


export function AudioPlayer({ audioUrl }: { audioUrl: string }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
      className="flex items-center gap-2 text-sm font-medium text-primary border border-primary px-3 py-1.5 rounded-lg"
    >
      {playing ? <Square size={14} /> : <Volume2 size={14} />}
      {playing ? "Stop" : "Listen in your language"}
    </button>
  );
}

