import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTenant } from "@/lib/aicollega/tenant-store";
import {
  MessageSquare,
  FileText,
  Mail,
  Settings,
  Code,
  TrendingUp,
  Copy,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard — AI Collega Makelaar",
  robots: { index: false, follow: false },
};

export default async function DashboardPage({
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

  // Simpele token-check — voor productie: gebruik Clerk of NextAuth
  const isAuthorized = !token || tenant.accessToken === token || tenant.isDemo;
  if (!isAuthorized) notFound();

  const widgetCode = `<script src="https://maisonblender.com/widget/aicollega.js" data-tenant="${tenantId}" defer></script>`;

  const quickLinks = [
    {
      Icon: FileText,
      label: "Woningomschrijving genereren",
      href: `content`,
      beschrijving: "Funda, Instagram en e-mailvarianten in seconden",
    },
    {
      Icon: Mail,
      label: "Opvolgmail schrijven",
      href: `content`,
      beschrijving: "Na een bezichtiging — persoonlijk en direct klaar",
    },
    {
      Icon: MessageSquare,
      label: "Demo bekijken",
      href: `/aicollega/makelaar/demo`,
      beschrijving: "Zie hoe jouw AI Collega reageert op vragen",
      external: true,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-120px)] bg-[#f2f3f5]">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-[#575760] mb-1">
                AI Collega Dashboard
              </p>
              <h1
                className="text-[24px] font-normal text-[#1f1f1f]"
                style={{ letterSpacing: "-0.4px" }}
              >
                {tenant.naam}
              </h1>
              {tenant.stad && (
                <p className="text-sm text-[#575760]">{tenant.stad}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-[#575760]">AI Collega actief</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Objecten in kennisbase", waarde: tenant.objecten?.length ?? 0, eenheid: "woningen" },
            { label: "FAQ-items", waarde: tenant.faq?.length ?? 0, eenheid: "vragen" },
            { label: "Toon", waarde: tenant.toon === "formeel" ? "Formeel" : "Informeel", eenheid: "" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-6">
              <p className="text-xs font-medium uppercase tracking-widest text-[#575760] mb-2">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-[#1f1f1f]">{stat.waarde}</span>
                {stat.eenheid && (
                  <span className="text-sm text-[#575760]">{stat.eenheid}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Acties */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {quickLinks.map((link) => (
            <Link
              key={link.label}
              href={link.external ? link.href : `/aicollega/makelaar/dashboard/${tenantId}/${link.href}?token=${token ?? ""}`}
              className="bg-white p-6 hover:bg-[#f9f9fb] transition-colors group"
            >
              <link.Icon className="h-5 w-5 text-[#1f1f1f] mb-4" strokeWidth={1.5} />
              <p className="font-semibold text-[#1f1f1f] mb-1 group-hover:underline">{link.label}</p>
              <p className="text-sm text-[#575760]">{link.beschrijving}</p>
            </Link>
          ))}
        </div>

        {/* Objecten overzicht */}
        {tenant.objecten && tenant.objecten.length > 0 && (
          <div className="bg-white mb-8">
            <div className="p-6 border-b border-black/5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-[#575760] mb-1">
                  Objecten in kennisbase
                </p>
                <p className="text-sm text-[#1f1f1f]">
                  Dit zijn de woningen die de AI Collega kent en kan bespreken.
                </p>
              </div>
              <TrendingUp className="h-5 w-5 text-[#575760]" strokeWidth={1.5} />
            </div>
            <div className="divide-y divide-black/5">
              {tenant.objecten.map((obj, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#1f1f1f]">{obj.adres}</p>
                    <p className="text-xs text-[#575760]">
                      {obj.type} · {obj.kamers} kamers · {obj.oppervlak} m²
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#1f1f1f]">
                      € {obj.prijs.toLocaleString("nl-NL")}
                    </p>
                    <p className={`text-xs ${obj.beschikbaar !== false ? "text-green-600" : "text-[#575760]"}`}>
                      {obj.beschikbaar !== false ? "Beschikbaar" : "Verkocht"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Widget installatie */}
        <div className="bg-[#1f1f1f] p-6 mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-white/50 mb-1">
                Widget installeren
              </p>
              <p className="text-sm text-white/70">
                Kopieer deze code-regel en plak hem net voor de sluit-tag{" "}
                <code className="text-white/90">&lt;/body&gt;</code> op je website.
              </p>
            </div>
            <Code className="h-5 w-5 text-white/40 shrink-0" strokeWidth={1.5} />
          </div>

          <div className="bg-black/30 p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            {widgetCode}
          </div>

          <button
            onClick={() => {}}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
            data-copy={widgetCode}
          >
            <Copy className="h-4 w-4" />
            Kopieer code
          </button>
        </div>

        {/* Instellingen link */}
        <div className="flex items-center justify-between bg-white p-5">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-[#575760]" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-semibold text-[#1f1f1f]">Instellingen aanpassen?</p>
              <p className="text-xs text-[#575760]">
                Objecten toevoegen, FAQ bijwerken of toon aanpassen? Neem contact op met MAISON BLNDR.
              </p>
            </div>
          </div>
          <a
            href="mailto:info@maisonblender.com?subject=AI Collega aanpassingen"
            className="text-sm font-medium text-[#1f1f1f] hover:underline whitespace-nowrap"
          >
            Mail ons
          </a>
        </div>

        {tenant.isDemo && (
          <div className="mt-4 bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
            <strong>Demo-modus:</strong> Dit is een demo-dashboard. Meld je eigen kantoor aan via{" "}
            <Link href="/aicollega/makelaar/onboarding" className="underline">
              het aanmeldformulier
            </Link>{" "}
            om een eigen AI Collega te activeren.
          </div>
        )}
      </div>
    </div>
  );
}
