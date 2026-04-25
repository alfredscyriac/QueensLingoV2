# QueensLingo — Claude Code Context File

> This file gives Claude Code full context on the NeighborTongue project so it can assist accurately and efficiently during hacking.

---

## 🧭 Project Overview

**QueensLingo** is a multilingual legal document assistant built for immigrants in Queens, NY. Users point their phone camera at any official English document (lease, utility notice, benefits letter, court summons, etc.), and the app:

1. Captures the image via camera or file upload
2. Sends it to Gemini 2.0 Flash (Vision) to extract and understand the document
3. Returns a structured JSON response with explanation, next steps, and local resources
4. Displays everything in the user's native language
5. Reads the explanation aloud via ElevenLabs TTS
6. Shows interactive resource cards with maps, phone numbers, links, and directions

**Hackathon Track:** Queens Borough — Diversity in Action (Multilingual Tools & Immigrant Support)  
**Event:** Hack Knight / Queens College Hackathon  
**Duration:** ~12 active coding hours (Apr 25 11AM – Apr 26 11:30AM, skipping overnight)  
**Team size:** 2 developers

---

## 🛠️ Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) | Foundation — use `/app` directory |
| Styling | Tailwind CSS | Mobile-first, utility classes only |
| AI / Vision | Google Gemini 2.0 Flash | Via `@google/generative-ai` SDK |
| Voice / TTS | ElevenLabs API | Free tier — read explanation aloud |
| Database | Supabase | Optional: store scan history |
| Maps | Google Maps JS SDK + Places API | Resource card directions |
| City Data | NYC Open Data API | No key needed for most endpoints |
| Deployment | Vercel | Deploy early for phone camera testing |
| Language | TypeScript | Strict mode preferred |

---

## 📁 Project Structure

```
neighbortongue/
├── app/
│   ├── layout.tsx                  # Root layout with fonts, metadata
│   ├── page.tsx                    # Landing/home page (do last)
│   ├── dashboard/
│   │   └── page.tsx                # Main app dashboard (build first)
│   └── api/
│       ├── analyze/
│       │   └── route.ts            # POST: receives image, calls Gemini, returns JSON
│       ├── tts/
│       │   └── route.ts            # POST: sends text to ElevenLabs, returns audio
│       └── resources/
│           └── route.ts            # GET: fetches NYC Open Data resources by zipcode
├── components/
│   ├── dashboard/
│   │   ├── LanguageZipSelector.tsx # Combobox dropdowns for language + zipcode
│   │   ├── CameraCapture.tsx       # Camera viewfinder + capture button
│   │   ├── NextStepsPanel.tsx      # Displays AI next steps in native language
│   │   ├── ResourceCard.tsx        # Individual interactive resource card
│   │   └── ResourceGrid.tsx        # Grid of ResourceCards
│   ├── ui/
│   │   ├── Combobox.tsx            # Reusable searchable dropdown
│   │   └── AudioPlayer.tsx         # Play/pause TTS audio
│   └── providers/
│       └── AppProvider.tsx         # React context: language, zipcode, scan state
├── lib/
│   ├── gemini.ts                   # Gemini client + analyzeDocument() function
│   ├── elevenlabs.ts               # ElevenLabs client + synthesizeSpeech() function
│   ├── nyc-open-data.ts            # NYC Open Data fetch helpers
│   ├── languages.ts                # Supported languages array with codes + labels
│   └── zipcodes.ts                 # Queens zipcodes array for combobox
├── types/
│   └── index.ts                    # Shared TypeScript types
├── public/
│   └── icons/                      # App icons, favicon
├── .env.local                      # API keys (never commit this)
├── .env.example                    # Template for teammates
└── CLAUDE.md                       # This file
```

---

## 🔑 Environment Variables

Create `.env.local` at project root:

```bash
# Gemini
GEMINI_API_KEY=your_gemini_api_key

# ElevenLabs
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=your_chosen_voice_id

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key

# Supabase (optional)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🤖 Core AI Prompt — Gemini

The `/api/analyze` route sends this prompt with the image to Gemini 2.0 Flash:

```
You are a multilingual legal document assistant helping immigrants in Queens, New York understand official documents.

The user's native language is: {language}
The user's zip code is: {zipcode}

Analyze the document in the image carefully. Then respond ONLY with a valid JSON object in this exact format — no markdown, no extra text:

{
  "document_type": "string — what kind of document this is (e.g. Eviction Notice, Utility Bill, Benefits Letter)",
  "translated_explanation": "string — a clear, simple explanation of what this document means, written entirely in {language}. Explain what it is, what it's asking, why it matters, and what happens if the user ignores it.",
  "next_steps": [
    "string — action item 1 in {language}",
    "string — action item 2 in {language}"
  ],
  "urgency": "low | medium | high",
  "resource_keywords": ["string", "string"] // 2-3 keywords to search NYC Open Data/Maps e.g. ["legal aid", "housing court", "notary"]
}
```

---

## 📐 Core TypeScript Types

```typescript
// types/index.ts

export type UrgencyLevel = 'low' | 'medium' | 'high';

export interface AnalysisResult {
  document_type: string;
  translated_explanation: string;
  next_steps: string[];
  urgency: UrgencyLevel;
  resource_keywords: string[];
}

export interface ResourceCard {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  maps_url: string;
  photo_url?: string;
  place_id?: string;
}

export interface AppState {
  language: string;         // BCP-47 code e.g. "es", "bn", "ml"
  languageLabel: string;    // Display name e.g. "Spanish"
  zipcode: string;
  analysisResult: AnalysisResult | null;
  resources: ResourceCard[];
  audioUrl: string | null;
  isAnalyzing: boolean;
}
```

---

## 🌍 Supported Languages (Priority List)

Use these for the language combobox. Include all but if forced to limit, keep this set:

```typescript
export const LANGUAGES = [
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'zh', label: 'Chinese (Simplified)', native: '中文' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'ko', label: 'Korean', native: '한국어' },
  { code: 'tl', label: 'Tagalog', native: 'Tagalog' },
  { code: 'ur', label: 'Urdu', native: 'اردو' },
  { code: 'ar', label: 'Arabic', native: 'العربية' },
  { code: 'pt', label: 'Portuguese', native: 'Português' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'ru', label: 'Russian', native: 'Русский' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },  // Team language
  { code: 'fa', label: 'Dari', native: 'دری' },           // Team language
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
];
```

---

## 📡 API Routes — Behavior Summary

### `POST /api/analyze`
- Accepts: `{ image: string (base64), language: string, zipcode: string }`
- Calls Gemini 2.0 Flash with vision + the prompt above
- Parses the JSON response
- Returns: `AnalysisResult` object

### `POST /api/tts`
- Accepts: `{ text: string, language: string }`
- Sends text to ElevenLabs API
- Returns: audio stream / base64 audio
- Note: ElevenLabs free tier supports multilingual voices — use `eleven_multilingual_v2` model

### `GET /api/resources?keywords=legal+aid&zipcode=11373`
- Calls NYC Open Data API for local service providers
- Returns: array of `ResourceCard` objects

---

## 📱 Dashboard UI — Component Behavior

### `LanguageZipSelector`
- Two comboboxes side by side (or stacked on mobile)
- User can type to filter — show only matching options
- Language selection persists in React context / localStorage
- Zipcode: only Queens zipcodes in the list (11101–11694 range)

### `CameraCapture`
- Uses `navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })` for rear camera on mobile
- Shows live video feed in a rounded container
- "Capture" button takes a snapshot via canvas
- "Upload Image" button as fallback (hidden file input triggered by button click)
- On capture: compress image to base64, trigger analysis flow

### `NextStepsPanel`
- Appears after analysis completes
- Shows `document_type` as a badge with urgency color (green/yellow/red)
- `translated_explanation` as main body text
- `next_steps` as a numbered list
- Speaker icon button → triggers TTS playback

### `ResourceCard`
- Image (Google Places photo or fallback illustration)
- Organization name
- Address
- Phone (click to call on mobile)
- Email (click to mailto)
- "Get Directions" → opens Google Maps in new tab
- "Visit Website" → external link

---

## ⚡ Data Flow (End to End)

```
User selects language + zipcode
        ↓
User points camera at document
        ↓
User taps "Capture" (or uploads image)
        ↓
Image → base64 → POST /api/analyze
        ↓
Gemini 2.0 Flash (Vision) processes image
        ↓
Returns structured JSON (AnalysisResult)
        ↓
┌───────────────┬──────────────────┬──────────────────┐
│               │                  │                  │
NextStepsPanel  POST /api/tts      GET /api/resources
(render text)   (ElevenLabs)       (NYC Open Data +
                     ↓              Google Maps)
               Audio plays              ↓
                              ResourceCard grid renders
```

---

## 🚫 What NOT to Build (Scope Control)

- ❌ Authentication / user accounts (skip for hackathon)
- ❌ Scan history / database persistence (skip unless time permits)
- ❌ Landing page (build last, 10 minutes max)
- ❌ Multi-page routing (single dashboard page is fine)
- ❌ Animations / micro-interactions (Tailwind transitions only if fast)
- ❌ PWA / offline support

---

## ✅ Definition of "Done" (MVP)

The project is complete when a judge can:
1. Open the app on a phone browser
2. Select a language and Queens zipcode
3. Point the camera at a document and capture it
4. See the explanation appear in their chosen language
5. Hear it read aloud
6. See at least 2 resource cards with real Queens organizations

---

## 🔧 Common Commands

```bash
# Install deps
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Type check
npx tsc --noEmit
```

---

## 💡 Claude Code Tips for This Project

- Always use TypeScript, never plain `.js` files
- API routes go in `app/api/.../route.ts` using Next.js Route Handlers
- Use `'use client'` directive only on components that need browser APIs (camera, audio)
- Keep API keys server-side only — never prefix with `NEXT_PUBLIC_` unless needed on client
- For Gemini: import from `@google/generative-ai`, model is `gemini-2.0-flash`
- For ElevenLabs: use `eleven_multilingual_v2` model for non-English TTS
- Image from camera: use `canvas.toDataURL('image/jpeg', 0.7)` and strip the data URL prefix before sending to API
- When in doubt, keep it simple and make it work — polish later