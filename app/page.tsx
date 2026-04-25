import { Languages, ScanLine, ShieldAlert, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Languages,
    title: 'Select your language & ZIP code',
    description: 'Choose your native language and your Queens ZIP code from the dropdowns.',
  },
  {
    icon: ScanLine,
    title: 'Scan or upload a document',
    description: 'Point your camera at any official letter, notice, or form and tap Capture.',
  },
  {
    icon: ShieldAlert,
    title: 'Privacy reminder',
    description: 'Do not scan or upload documents containing sensitive personal information such as SSNs or bank details.',
    warning: true,
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">

      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/cherryblossom.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen px-4 sm:px-6">

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center gap-10 pt-24 pb-10 text-center">
          <div className="flex flex-col items-center gap-4 max-w-lg">
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight text-white">
              Trust Your Native Tongue
            </h1>
            <p className="text-base sm:text-lg text-zinc-300 max-w-sm">
              Hear your documents explained in your native language in a matter of seconds (supporting 15+ languages)
            </p>
          </div>

          {/* How-to steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
            {steps.map(({ icon: Icon, title, description, warning }) => (
              <div
                key={title}
                className={`flex flex-col items-center gap-3 rounded-2xl px-5 py-6 text-center backdrop-blur-sm border ${
                  warning
                    ? 'bg-red-950/60 border-red-700/50 text-red-200'
                    : 'bg-white/10 border-white/20 text-white'
                }`}
              >
                <Icon
                  size={28}
                  className={warning ? 'text-red-400' : 'text-pink-700'}
                  strokeWidth={1.75}
                />
                <p className="font-bold text-sm leading-snug">{title}</p>
                <p className={`text-xs leading-relaxed ${warning ? 'text-red-300' : 'text-zinc-300'}`}>
                  {description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <a
            href="/dashboard"
            className="flex items-center gap-2 bg-pink-700 hover:bg-pink-800 active:scale-95 transition-all duration-150 text-white font-extrabold text-sm tracking-widest uppercase px-8 py-4 rounded-2xl"
            style={{ boxShadow: '0 4px 0 #831843' }}
          >
            Get Started
            <ArrowRight size={16} />
          </a>
        </main>

        <footer className="relative z-10 py-4 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} QueensLingo · Queens College Hackathon
        </footer>
      </div>
    </div>
  );
}
