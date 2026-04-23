import Link from "next/link";

/**
 * WCAG 2.4.1 Bypass Blocks — first focusable in document flow.
 * Target: element with id="main" (set on each page's primary <main>).
 */
export default function SkipLink() {
  return (
    <Link
      href="#main"
      className="mb-skip-link rounded-lg bg-[#1f1f1f] px-4 py-3 text-sm font-semibold text-white shadow-lg outline-none ring-[#4af0c4] focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      Naar hoofdinhoud
    </Link>
  );
}
