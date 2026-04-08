'use client';

import { useState, FormEvent } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Succesvol ingeschreven!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Er ging iets mis, probeer het opnieuw');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Er ging iets mis, probeer het opnieuw');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 text-left">
      <p className="text-sm font-semibold text-[#1f1f1f] mb-1">Schrijf je in</p>
      <p className="text-xs text-[#575760] mb-6">Gratis · Maandelijks · Altijd afmeldbaar</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          placeholder="jouw@email.nl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === 'loading' || status === 'success'}
          className="flex-1 rounded-xl border border-black/[0.1] bg-[#f2f3f5] px-4 py-3 text-sm text-[#1f1f1f] placeholder-[#b2b2be] focus:outline-none focus:ring-2 focus:ring-[#22c55e] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="rounded-full bg-[#22c55e] px-8 py-3 text-sm font-semibold text-[#1f1f1f] transition-all hover:bg-[#16a34a] hover:shadow-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Bezig...' : status === 'success' ? 'Ingeschreven ✓' : 'Schrijf me in →'}
        </button>
      </form>

      {message && (
        <p className={`mt-3 text-sm ${status === 'success' ? 'text-[#22c55e]' : 'text-red-600'}`}>
          {message}
        </p>
      )}

      <p className="mt-3 text-xs text-[#b2b2be]">
        Door je in te schrijven ga je akkoord met onze privacyverklaring. Je ontvangt maximaal één e-mail per maand.
      </p>
    </div>
  );
}
