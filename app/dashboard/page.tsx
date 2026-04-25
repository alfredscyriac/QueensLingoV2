"use client";

import { useState } from "react";
import { LanguageZipSelector } from "@/components/dashboard/LanguageZipSelector";

export default function DashboardPage() {
  const [_language, setLanguage] = useState("");
  const [_zip, setZip] = useState("");

  return (
    <main className="flex min-h-screen flex-col gap-6 p-6">
      <LanguageZipSelector
        onLanguageChange={setLanguage}
        onZipChange={setZip}
      />

      {/* CameraCapture goes here */}

      {/* NextStepsPanel goes here */}

      {/* ResourceGrid goes here */}
    </main>
  );
}
