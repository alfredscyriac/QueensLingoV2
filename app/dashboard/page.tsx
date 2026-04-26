'use client';

import { useState } from 'react';
import { CameraCapture } from '@/components/dashboard/CameraCapture';
import { LanguageZipSelector } from '@/components/dashboard/LanguageZipSelector';
import { NextStepsPanel } from '@/components/dashboard/NextStepsPanel';
import { ResourceGrid } from '@/components/dashboard/ResourceGrid';
import { LANGUAGES } from '@/lib/languages';
import { AnalysisResult, ResourceOrg } from '@/types';

type Language = (typeof LANGUAGES)[number];

export default function Dashboard() {
  const [language, setLanguage] = useState<Language | null>(null);
  const [zipcode, setZipcode] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [resources, setResources] = useState<ResourceOrg[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isReady = !!language && !!zipcode;

  const handleCapture = async (base64: string) => {
    setIsAnalyzing(true);
    setResult(null);
    setResources([]);
    setAudioUrl(null);
    setError(null);

    try {
      // Step 1: Analyze document with Gemini
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64,
          language: language!.label,
          zipcode,
        }),
      });

      if (!analyzeRes.ok) throw new Error('Analysis failed');
      const data: AnalysisResult = await analyzeRes.json();
      setResult(data);

      const [ttsRes, resourcesRes] = await Promise.all([
        fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: data.translated_explanation }),
        }),
        fetch(
          `/api/resources?keywords=${data.resource_keywords.join(
            ","
          )}&zipcode=${zipcode}`
        ),
      ]);

      const blob = await ttsRes.blob();
      setAudioUrl(URL.createObjectURL(blob));
      setResources(await resourcesRes.json());
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again with better lighting.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white overflow-x-hidden">
      {/* Ambient glow blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#E91E7B]/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#E07A6A]/10 blur-[120px]" />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6 pt-20 pb-16 flex flex-col gap-8">

        <LanguageZipSelector
          language={language}
          zipcode={zipcode}
          onLanguageChange={setLanguage}
          onZipcodeChange={setZipcode}
        />

        <CameraCapture
          onCapture={handleCapture}
          isAnalyzing={isAnalyzing}
          isReady={isReady}
        />

        {/* Error state */}
        {error && (
          <div className="rounded-2xl bg-red-950/60 border border-red-700/50 p-4 max-w-[640px] mx-auto w-full">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <NextStepsPanel
            result={result}
            audioUrl={audioUrl}
            language={language!}
          />
        )}

        {/* Resource cards */}
        {resources.length > 0 && (
          <div className="w-full max-w-[640px] mx-auto">
            <ResourceGrid resources={resources} />
          </div>
        )}
      </main>
    </div>
  );
}

