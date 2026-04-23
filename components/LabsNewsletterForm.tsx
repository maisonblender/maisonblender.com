"use client";

export default function LabsNewsletterForm() {
  return (
    <form
      className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
      onSubmit={(e) => e.preventDefault()}
      aria-label="Nieuwsbrief aanmelding"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <label htmlFor="labs-newsletter-email" className="sr-only">
          E-mailadres voor nieuwsbrief
        </label>
        <input
          id="labs-newsletter-email"
          type="email"
          name="email"
          placeholder="jouw@emailadres.nl"
          autoComplete="email"
          aria-describedby="labs-newsletter-hint"
          className="flex-1 border border-black/10 bg-white px-4 py-3 text-sm text-[#1f1f1f] outline-none transition-colors placeholder:text-[#575760]/70 focus:border-[#1f1f1f]"
        />
        <span id="labs-newsletter-hint" className="sr-only">
          Maximaal één e-mail per maand. Altijd afmeldbaar.
        </span>
      </div>
      <button
        type="submit"
        className="whitespace-nowrap rounded-full bg-[#1f1f1f] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#3a3a42] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a7a5c] focus-visible:ring-offset-2"
      >
        Schrijf me in
      </button>
    </form>
  );
}
