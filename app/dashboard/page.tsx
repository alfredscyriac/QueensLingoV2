'use client';
import { useState } from 'react';
import { CameraCapture } from '@/components/dashboard/CameraCapture';
import { LanguageZipSelector } from '@/components/dashboard/LanguageZipSelector';
import { AnalysisResult, ResourceOrg } from '@/types';

export default function Dashboard() {
  const [language, setLanguage] = useState('Spanish');
  const [zipcode, setZipcode] = useState('11373');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [resources, setResources] = useState<ResourceOrg[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleCapture = async (base64: string) => {
    setIsAnalyzing(true);
    setResult(null); setResources([]); setAudioUrl(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, language, zipcode }),
      });
      const data: AnalysisResult = await res.json();
      setResult(data);

      const resourcesRes = await fetch(`/api/resources?keywords=${data.resource_keywords.join(',')}&zipcode=${zipcode}`);
      setResources(await resourcesRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="max-w-md mx-auto p-4 space-y-4 min-h-screen">
      <h1 className="text-2xl font-bold">QueensLinGov</h1>
      <LanguageZipSelector
        onLanguageChange={setLanguage} onZipChange={setZipcode}
      />
      <CameraCapture onCapture={handleCapture} isAnalyzing={isAnalyzing} />
    </main>
  );
}
