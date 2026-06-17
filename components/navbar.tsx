import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          BlogCMS
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
          >
            Home
          </Link>
          <Link
            href="/admin/login"
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-50 transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
