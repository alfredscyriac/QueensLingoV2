export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header / Nav */}
      <header className="flex items-center justify-center py-4 border-b border-gray-100">
        <span className="text-3xl font-extrabold tracking-tight text-sky-400">
          QueensLingo
        </span>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center gap-10">
        {/* Tagline */}
        <div className="flex flex-col items-center gap-3 max-w-md">
          <h1 className="text-4xl font-extrabold leading-tight text-gray-800">
            Translating Queens, One Sign at a Time
          </h1>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          {/* Primary Button */}
          <a
            href="/dashboard"
            className="w-full flex items-center justify-center rounded-2xl py-4 text-white font-extrabold text-sm tracking-widest uppercase bg-sky-400 hover:bg-sky-500 active:scale-95 transition-all duration-150"
            style={{ boxShadow: "0 4px 0 #0284c7" }}
          >
            Get Started
          </a>
        </div>
      </main>
    </div>
  );
}
