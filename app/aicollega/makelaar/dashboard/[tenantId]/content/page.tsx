import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTenant } from "@/lib/aicollega/tenant-store";
import ContentGenerator from "./ContentGenerator";

export const metadata: Metadata = {
  title: "Content genereren — AI Collega Makelaar Dashboard",
  robots: { index: false, follow: false },
};

export default async function ContentPage({
  params,
  searchParams,
}: {
  params: Promise<{ tenantId: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { tenantId } = await params;
  const { token } = await searchParams;

  const tenant = getTenant(tenantId);
  if (!tenant) notFound();

  const isAuthorized = !token || tenant.accessToken === token || tenant.isDemo;
  if (!isAuthorized) notFound();

  return (
    <div className="min-h-[calc(100vh-120px)] bg-[#f2f3f5]">
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-16">
        <div className="max-w-3xl">
        <Link
          href={`/aicollega/makelaar/dashboard/${tenantId}?token=${token ?? ""}`}
          className="inline-flex items-center gap-2 text-sm text-[#575760] hover:text-[#1f1f1f] transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Terug naar dashboard
        </Link>

        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-widest text-[#575760] mb-2">
            Content genereren
          </p>
          <h1
            className="text-[24px] font-normal text-[#1f1f1f]"
            style={{ letterSpacing: "-0.4px" }}
          >
            Woningomschrijvingen & mails
          </h1>
          <p className="text-sm text-[#575760] mt-1">
            Kies een type, vul de details in en krijg direct klaar-voor-gebruik teksten.
          </p>
        </div>

        <ContentGenerator tenantId={tenantId} branche="makelaar" />
        </div>
      </div>
    </div>
  );
}
