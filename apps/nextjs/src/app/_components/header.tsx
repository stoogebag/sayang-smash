import Link from "next/link";

export function Header() {
  return (
    <header className="bg-card border-border sticky top-0 z-50 w-full border-b-4">
      <div className="phone-container flex h-16 items-center px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="a-bar h-6"></div>
          <span className="font-display text-2xl font-bold tracking-tight uppercase">
            Sayang Smash
          </span>
        </Link>
      </div>
    </header>
  );
}
