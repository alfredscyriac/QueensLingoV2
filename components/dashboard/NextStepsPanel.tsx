'use client';

import { AnalysisResult } from '@/types';
import { AudioPlayer } from '@/components/ui/AudioPlayer';

interface Props {
  result: AnalysisResult;
  audioUrl: string | null;
  language: { code: string; label: string; native: string; ttsSupported: boolean };
}

const urgencyConfig = {
  low: { label: 'Low Priority', className: 'bg-green-100 text-green-800 border-green-200' },
  medium: { label: 'Action Needed', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  high: { label: 'Urgent', className: 'bg-red-100 text-red-800 border-red-200' },
};

export function NextStepsPanel({ result, audioUrl, language }: Props) {
  const urgency = urgencyConfig[result.urgency] ?? urgencyConfig.low;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-4">

      {/* Document type + urgency badge */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="font-semibold text-sm text-foreground">{result.document_type}</p>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${urgency.className}`}>
          {urgency.label}
        </span>
      </div>

      {/* Explanation in native language */}
      <p className="text-sm text-foreground leading-relaxed">
        {result.translated_explanation}
      </p>

      {/* Next steps */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Next Steps
        </p>
        <ol className="space-y-2">
          {result.next_steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* TTS audio */}
      {language.ttsSupported && audioUrl && (
        <AudioPlayer audioUrl={audioUrl} />
      )}
      {!language.ttsSupported && (
        <p className="text-xs text-muted-foreground">
          Audio playback not available for {language.label}
        </p>
      )}
    </div>
  );
}