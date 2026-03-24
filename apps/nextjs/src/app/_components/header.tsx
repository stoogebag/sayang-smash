"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  // Don't show header on landing page
  if (pathname === "/") return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#334155] bg-[#172033]">
      <div className="mx-auto flex h-14 max-w-[420px] items-center px-5">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-6 w-1 bg-gradient-to-b from-orange-500 to-orange-600" />
          <span className="font-display font-800 text-lg tracking-tight text-[#f8fafc] uppercase">
            Sayang Smash
          </span>
        </Link>
      </div>
    </header>
  );
}
