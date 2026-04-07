"use client";

export default function LabsNewsletterForm() {
  return (
    <form
      className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="jouw@emailadres.nl"
        className="flex-1 border border-black/10 bg-white px-4 py-3 text-sm text-[#1f1f1f] placeholder:text-[#575760]/50 outline-none focus:border-[#1f1f1f] transition-colors"
      />
      <button
        type="submit"
        className="rounded-full bg-[#1f1f1f] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#3a3a42] hover:shadow-lg whitespace-nowrap"
      >
        Schrijf me in
      </button>
    </form>
  );
}
