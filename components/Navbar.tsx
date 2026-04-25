import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center px-4 sm:px-6 py-4">
      <Link href="/" className="text-4xl font-extrabold tracking-tight py-4">
        <span className="text-white">QUEENS</span>
        <span className="text-pink-700">LINGO</span>
      </Link>
    </nav>
  );
}
