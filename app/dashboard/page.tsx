'use client';

import { useState } from 'react';
import { CameraCapture } from '@/components/dashboard/CameraCapture';
import { LanguageZipSelector } from '@/components/dashboard/LanguageZipSelector';
import { NextStepsPanel } from '@/components/dashboard/NextStepsPanel';
import { ResourceGrid } from '@/components/dashboard/ResourceGrid';
import { LANGUAGES } from '@/lib/languages';
import { AnalysisResult, ResourceOrg } from '@/types';

const DEFAULT_LANGUAGE = LANGUAGES.find(l => l.code === 'es')!;
const DEFAULT_ZIPCODE = '11373';

export default function Dashboard() {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [zipcode, setZipcode] = useState(DEFAULT_ZIPCODE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [resources, setResources] = useState<ResourceOrg[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          language: language.label,
          zipcode,
        }),
      });

      if (!analyzeRes.ok) throw new Error('Analysis failed');
      const data: AnalysisResult = await analyzeRes.json();
      setResult(data);

      // Step 2: Fetch resources (always)
      const resourcesRes = await fetch(
        `/api/resources?keywords=${data.resource_keywords.join(',')}&zipcode=${zipcode}`
      );
      if (resourcesRes.ok) {
        setResources(await resourcesRes.json());
      }

      // Step 3: TTS only if language supports it
      if (language.ttsSupported) {
        const ttsRes = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: data.translated_explanation }),
        });
        if (ttsRes.ok) {
          const blob = await ttsRes.blob();
          setAudioUrl(URL.createObjectURL(blob));
        }
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again with better lighting.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="max-w-md mx-auto p-4 space-y-4 min-h-screen pb-12">
      {/* Language + Zipcode selectors */}
      <LanguageZipSelector
        language={language}
        zipcode={zipcode}
        onLanguageChange={setLanguage}
        onZipcodeChange={setZipcode}
      />

      {/* Camera */}
      <CameraCapture
        onCapture={handleCapture}
        isAnalyzing={isAnalyzing}
      />

      {/* Error state */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <NextStepsPanel
          result={result}
          audioUrl={audioUrl}
          language={language}
        />
      )}

      {/* Resource cards */}
      {resources.length > 0 && (
        <ResourceGrid resources={resources} />
      )}
    </main>
  );
}
