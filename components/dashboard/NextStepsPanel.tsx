'use client';

import { AnalysisResult } from '@/types';
import { AudioPlayer } from '@/components/ui/AudioPlayer';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  result: AnalysisResult;
  audioUrl: string | null;
  language: { code: string; label: string; native: string; ttsSupported: boolean };
}

const urgencyConfig = {
  low: { label: 'Low Priority', className: 'bg-green-900/40 text-green-300 border-green-700/50' },
  medium: { label: 'Action Needed', className: 'bg-yellow-900/40 text-yellow-300 border-yellow-700/50' },
  high: { label: 'Urgent', className: 'bg-red-900/40 text-red-300 border-red-700/50' },
};

export function NextStepsPanel({ result, audioUrl, language }: Props) {
  const urgency = urgencyConfig[result.urgency] ?? urgencyConfig.low;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
      className="w-full max-w-[640px] mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
    >
      {/* Top highlight line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E91E7B] to-[#E07A6A] flex items-center justify-center text-white shadow-lg shrink-0">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">{result.document_type}</h2>
            <p className="text-white/60 text-sm">AI Analysis Complete</p>
          </div>
        </div>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${urgency.className}`}>
          {urgency.label}
        </span>
      </div>

      <div className="space-y-6">
        {/* Explanation */}
        <div className="bg-black/20 rounded-2xl p-5 border border-white/5">
          <p className="text-white/90 leading-relaxed text-sm">{result.translated_explanation}</p>
        </div>

        {/* Next steps */}
        <ul className="space-y-4 px-2">
          {result.next_steps.map((step, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.15, type: 'spring' }}
              className="flex items-start gap-3"
            >
              <CheckCircle2 className="text-[#E91E7B] shrink-0 mt-0.5" size={20} />
              <span className="text-white/80 leading-relaxed text-sm">{step}</span>
            </motion.li>
          ))}
        </ul>

        {/* TTS audio */}
        {language.ttsSupported && audioUrl && (
          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-white/50 mb-4 uppercase tracking-widest font-semibold ml-2">
              Listen to translation
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <AudioPlayer audioUrl={audioUrl} />
            </motion.div>
          </div>
        )}
        {!language.ttsSupported && (
          <p className="text-xs text-white/40 pt-2">
            Audio playback not available for {language.label}
          </p>
        )}
      </div>
    </motion.div>
  );
}
