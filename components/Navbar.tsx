import Link from 'next/link';
import Image from 'next/image';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center px-4 sm:px-6 py-4">
      <Link href="/">
        <Image src="/queenslingo.png" alt="QueensLingo" width={160} height={160} className="h-12 w-auto" />
      </Link>
    </nav>
  );
}
