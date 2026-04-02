import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { services, getServiceBySlug } from "@/lib/services";

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    keywords: service.keywords,
    alternates: {
      canonical: `https://maisonblender.com/diensten/${service.slug}`,
    },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: `https://maisonblender.com/diensten/${service.slug}`,
      siteName: "Maison Blender",
      locale: "nl_NL",
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const otherServices = services.filter((s) => s.slug !== service.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": service.jsonLdId,
        name: service.title,
        description: service.longDescription.join(" "),
        provider: {
          "@type": "Organization",
          "@id": "https://maisonblender.com/#organization",
          name: "Maison Blender",
        },
        areaServed: [
          { "@type": "State", name: "Limburg" },
          { "@type": "City", name: "Sittard" },
          { "@type": "City", name: "Maastricht" },
          { "@type": "City", name: "Heerlen" },
        ],
        serviceType: service.jsonLdServiceType,
        url: `https://maisonblender.com/diensten/${service.slug}`,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://maisonblender.com/diensten/${service.slug}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://maisonblender.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Diensten",
            item: "https://maisonblender.com/#diensten",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: service.title,
            item: `https://maisonblender.com/diensten/${service.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />

      <main className="pt-[72px]">
        {/* Hero */}
        <section className="px-6 py-20 lg:py-32 bg-[#f2f3f5]">
          <div className="mx-auto max-w-6xl">
            <nav className="mb-8 flex items-center gap-2 text-xs text-[#575760]">
              <Link href="/" className="hover:text-[#1f1f1f] transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/#diensten" className="hover:text-[#1f1f1f] transition-colors">
                Diensten
              </Link>
              <span>/</span>
              <span className="text-[#1f1f1f]">{service.title}</span>
            </nav>

            <div className="flex flex-col gap-4 max-w-3xl">
              <span className="text-xs font-medium uppercase tracking-widest text-[#575760]">
                {service.subtitle}
              </span>
              <h1
                className="text-4xl font-black tracking-tight text-[#1f1f1f] sm:text-5xl lg:text-6xl"
                style={{ letterSpacing: "-0.95px" }}
              >
                {service.title.includes("&") ? (
                  <>
                    {service.title.split("&")[0].trim()}
                    <br />
                    <span className="font-exposure">&amp; {service.title.split("&")[1].trim()}</span>
                  </>
                ) : (
                  <span className="font-exposure">{service.title}</span>
                )}
              </h1>
              <p className="text-lg text-[#575760] max-w-xl leading-relaxed">
                {service.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/#contact"
                  className="rounded-full bg-[#1f1f1f] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#3a3a42]"
                >
                  Gratis strategiegesprek
                </Link>
                <Link
                  href="/diensten/ai-strategie-quickscan"
                  className="rounded-full border border-[#1f1f1f]/20 px-6 py-3 text-sm font-medium text-[#1f1f1f] transition-all hover:bg-white"
                >
                  Bekijk quickscan
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Tags */}
        <section className="border-b border-black/[0.06] bg-white px-6 py-6">
          <div className="mx-auto max-w-6xl flex flex-wrap gap-2">
            {service.tags.map((tag) => (
              <span
                key={tag}
                className="border border-black/[0.08] bg-[#f2f3f5] px-3 py-1.5 text-xs font-medium text-[#575760]"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Long description */}
        <section className="px-6 py-20 lg:py-28">
          <div className="mx-auto max-w-6xl grid gap-16 lg:grid-cols-3">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <h2
                className="text-2xl font-black tracking-tight text-[#1f1f1f] sm:text-3xl"
                style={{ letterSpacing: "-0.5px" }}
              >
                Wat wij voor u doen
              </h2>
              {service.longDescription.map((paragraph, i) => (
                <p key={i} className="text-[#575760] leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Benefits sidebar */}
            <aside className="flex flex-col gap-6">
              <div className="bg-[#f2f3f5] p-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-[#1f1f1f]">
                  Voordelen
                </h3>
                <ul className="flex flex-col gap-3">
                  {service.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#575760]">
                      <span className="mt-0.5 shrink-0 h-4 w-4 rounded-full bg-[#4af0c4] flex items-center justify-center">
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path d="M1 3L3 5L7 1" stroke="#1f1f1f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#1f1f1f] p-6 text-white">
                <h3 className="mb-2 text-sm font-bold">Klaar om te starten?</h3>
                <p className="mb-4 text-xs text-white/70 leading-relaxed">
                  Plan een gratis strategiegesprek en ontdek hoe {service.title} uw bedrijf versterkt.
                </p>
                <Link
                  href="/#contact"
                  className="block rounded-full bg-white px-4 py-2.5 text-center text-xs font-medium text-[#1f1f1f] transition-all hover:bg-[#f2f3f5]"
                >
                  Afspraak inplannen
                </Link>
              </div>
            </aside>
          </div>
        </section>

        {/* Use cases */}
        <section className="bg-[#f2f3f5] px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-col gap-3">
              <span className="text-xs font-medium uppercase tracking-widest text-[#575760]">
                Toepassingen
              </span>
              <h2
                className="text-2xl font-black tracking-tight text-[#1f1f1f] sm:text-3xl"
                style={{ letterSpacing: "-0.5px" }}
              >
                Waarvoor gebruiken onze klanten dit?
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {service.useCases.map((useCase, i) => (
                <div key={i} className="bg-white p-6 flex items-start gap-4">
                  <span className="font-mono text-xs text-[#575760]/60 shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm text-[#1f1f1f] font-medium leading-snug">{useCase}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technologies */}
        <section className="px-6 py-12 border-b border-black/[0.06]">
          <div className="mx-auto max-w-6xl flex flex-wrap items-center gap-4">
            <span className="text-xs font-medium uppercase tracking-widest text-[#575760] mr-2">
              Technologieën:
            </span>
            {service.technologies.map((tech) => (
              <span
                key={tech}
                className="border border-black/[0.08] bg-white px-3 py-1.5 text-xs text-[#575760]"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Other services */}
        <section className="px-6 py-20 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-col gap-3">
              <span className="text-xs font-medium uppercase tracking-widest text-[#575760]">
                Meer diensten
              </span>
              <h2
                className="text-2xl font-black tracking-tight text-[#1f1f1f] sm:text-3xl"
                style={{ letterSpacing: "-0.5px" }}
              >
                Ontdek onze andere diensten
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {otherServices.map((s) => (
                <Link
                  key={s.slug}
                  href={`/diensten/${s.slug}`}
                  className="group flex flex-col gap-4 bg-[#f2f3f5] p-6 transition-colors hover:bg-white border border-transparent hover:border-black/[0.06]"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs text-[#575760]/60">{s.id}</span>
                    <div className="h-px w-8 bg-black/20 transition-all group-hover:w-16 group-hover:bg-black/40" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-bold text-[#1f1f1f]">{s.title}</h3>
                    <p className="text-xs text-[#575760]">{s.subtitle}</p>
                  </div>
                  <p className="text-xs leading-relaxed text-[#575760] line-clamp-2">{s.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#1f1f1f] px-6 py-20 text-white">
          <div className="mx-auto max-w-6xl flex flex-col items-center gap-6 text-center">
            <h2
              className="text-3xl font-black tracking-tight sm:text-4xl"
              style={{ letterSpacing: "-0.95px" }}
            >
              Klaar voor{" "}
              <span className="font-exposure">{service.title}?</span>
            </h2>
            <p className="max-w-lg text-white/70">
              Plan een gratis strategiegesprek en ontdek wat AI concreet voor uw organisatie kan betekenen.
              Geen verplichtingen, wel direct inzicht.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/#contact"
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[#1f1f1f] transition-all hover:bg-[#f2f3f5]"
              >
                Strategiegesprek inplannen
              </Link>
              <Link
                href="/diensten/ai-strategie-quickscan"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/10"
              >
                Gratis quickscan
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
