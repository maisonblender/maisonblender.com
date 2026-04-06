import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { services, getServiceBySlug } from "@/lib/services";
import { tagPages, getTagPageBySlug } from "@/lib/tag-pages";

export async function generateStaticParams() {
  return [
    ...services.map((s) => ({ slug: s.slug })),
    ...tagPages.map((t) => ({ slug: t.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  const tagPage = service ? undefined : getTagPageBySlug(slug);
  const page = service ?? tagPage;
  if (!page) return {};

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.keywords,
    alternates: {
      canonical: `https://maisonblender.com/diensten/${page.slug}`,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `https://maisonblender.com/diensten/${page.slug}`,
      siteName: "MAISON BLNDR",
      locale: "nl_NL",
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
  };
}

export default async function DienstenPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  const tagPage = service ? undefined : getTagPageBySlug(slug);

  if (!service && !tagPage) notFound();

  if (tagPage) {
    const parentService = getServiceBySlug(tagPage.parentSlug);
    const otherServices = services.filter((s) => s.slug !== tagPage.parentSlug).slice(0, 3);

    const faqJsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          "@id": tagPage.jsonLdId,
          name: tagPage.title,
          description: tagPage.longDescription.join(" "),
          provider: {
            "@type": "Organization",
            "@id": "https://maisonblender.com/#organization",
            name: "MAISON BLNDR",
          },
          areaServed: [
            { "@type": "State", name: "Limburg" },
            { "@type": "City", name: "Sittard" },
            { "@type": "City", name: "Maastricht" },
            { "@type": "City", name: "Heerlen" },
          ],
          url: `https://maisonblender.com/diensten/${tagPage.slug}`,
        },
        {
          "@type": "FAQPage",
          "@id": `https://maisonblender.com/diensten/${tagPage.slug}#faq`,
          mainEntity: tagPage.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        },
        {
          "@type": "BreadcrumbList",
          "@id": `https://maisonblender.com/diensten/${tagPage.slug}#breadcrumb`,
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
              name: tagPage.parentTitle,
              item: `https://maisonblender.com/diensten/${tagPage.parentSlug}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: tagPage.title,
              item: `https://maisonblender.com/diensten/${tagPage.slug}`,
            },
          ],
        },
      ],
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
                <Link href={`/diensten/${tagPage.parentSlug}`} className="hover:text-[#1f1f1f] transition-colors">
                  {tagPage.parentTitle}
                </Link>
                <span>/</span>
                <span className="text-[#1f1f1f]">{tagPage.title}</span>
              </nav>

              <div className="flex flex-col gap-4 max-w-3xl">
                <span className="text-xs font-medium uppercase tracking-widest text-[#575760]">
                  {tagPage.subtitle}
                </span>
                <h1
                  className="text-[28px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[35px] lg:text-[42px] font-exposure"
                  style={{ letterSpacing: "-0.95px" }}
                >
                  {tagPage.title}
                </h1>
                <p className="text-lg text-[#575760] max-w-xl leading-relaxed">
                  {tagPage.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/strategiegesprek"
                    className="rounded-full bg-[#1f1f1f] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#3a3a42]"
                  >
                    Gratis strategiegesprek
                  </Link>
                  <Link
                    href="/quickscan"
                    className="rounded-full border border-[#1f1f1f]/20 px-6 py-3 text-sm font-medium text-[#1f1f1f] transition-all hover:bg-white"
                  >
                    Start gratis AI-scan
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Tags */}
          <section className="border-b border-black/[0.06] bg-white px-6 py-6">
            <div className="mx-auto max-w-6xl flex flex-wrap gap-2">
              {tagPage.tags.map((tag) => (
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
                  className="text-[20px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px]"
                  style={{ letterSpacing: "-0.5px" }}
                >
                  Wat wij voor je doen
                </h2>
                {tagPage.longDescription.map((paragraph, i) => (
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
                    {tagPage.benefits.map((benefit, i) => (
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
                    Plan een gratis strategiegesprek en ontdek hoe {tagPage.title} je bedrijf versterkt.
                  </p>
                  <Link
                    href="/strategiegesprek"
                    className="block rounded-full bg-white px-4 py-2.5 text-center text-xs font-medium text-[#1f1f1f] transition-all hover:bg-[#f2f3f5]"
                  >
                    Afspraak inplannen
                  </Link>
                </div>
              </aside>
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-[#f2f3f5] px-6 py-16 lg:py-24">
            <div className="mx-auto max-w-6xl">
              <div className="mb-10 flex flex-col gap-3">
                <span className="text-xs font-medium uppercase tracking-widest text-[#575760]">
                  Veelgestelde vragen
                </span>
                <h2
                  className="text-[20px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px]"
                  style={{ letterSpacing: "-0.5px" }}
                >
                  Alles over {tagPage.title}
                </h2>
              </div>
              <div className="flex flex-col gap-4 max-w-3xl">
                {tagPage.faqs.map((faq, i) => (
                  <div key={i} className="bg-white p-6">
                    <h3 className="mb-3 text-sm font-bold text-[#1f1f1f]">{faq.question}</h3>
                    <p className="text-sm text-[#575760] leading-relaxed">{faq.answer}</p>
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
              {tagPage.technologies.map((tech) => (
                <span
                  key={tech}
                  className="border border-black/[0.08] bg-white px-3 py-1.5 text-xs text-[#575760]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* Parent service + other services */}
          <section className="px-6 py-20 lg:py-28">
            <div className="mx-auto max-w-6xl">
              <div className="mb-10 flex flex-col gap-3">
                <span className="text-xs font-medium uppercase tracking-widest text-[#575760]">
                  Meer diensten
                </span>
                <h2
                  className="text-[20px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px]"
                  style={{ letterSpacing: "-0.5px" }}
                >
                  Ontdek onze andere diensten
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {parentService && (
                  <Link
                    href={`/diensten/${parentService.slug}`}
                    className="group flex flex-col gap-4 bg-[#1f1f1f] p-6 text-white transition-colors hover:bg-[#2a2a32]"
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-xs text-white/40">{parentService.id}</span>
                      <div className="h-px w-8 bg-white/20 transition-all group-hover:w-16 group-hover:bg-white/40" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-bold">{parentService.title}</h3>
                      <p className="text-xs text-white/60">{parentService.subtitle}</p>
                    </div>
                    <p className="text-xs leading-relaxed text-white/60 line-clamp-2">{parentService.description}</p>
                  </Link>
                )}
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
                className="text-[24px] font-normal leading-[1.2] tracking-tight sm:text-[29px] lg:text-[35px]"
                style={{ letterSpacing: "-0.95px" }}
              >
                Klaar voor{" "}
                <span className="font-exposure">{tagPage.title}?</span>
              </h2>
              <p className="max-w-lg text-white/70">
                Plan een gratis strategiegesprek en ontdek wat AI concreet voor je bedrijf kan betekenen.
                Geen verplichtingen, wel direct inzicht.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/strategiegesprek"
                  className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[#1f1f1f] transition-all hover:bg-[#f2f3f5]"
                >
                  Strategiegesprek inplannen
                </Link>
                <Link
                  href="/quickscan"
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/10"
                >
                  Start gratis AI-scan
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  // --- Service page ---
  const otherServices = services.filter((s) => s.slug !== service!.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": service!.jsonLdId,
        name: service!.title,
        description: service!.longDescription.join(" "),
        provider: {
          "@type": "Organization",
          "@id": "https://maisonblender.com/#organization",
          name: "MAISON BLNDR",
        },
        areaServed: [
          { "@type": "State", name: "Limburg" },
          { "@type": "City", name: "Sittard" },
          { "@type": "City", name: "Maastricht" },
          { "@type": "City", name: "Heerlen" },
        ],
        serviceType: service!.jsonLdServiceType,
        url: `https://maisonblender.com/diensten/${service!.slug}`,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://maisonblender.com/diensten/${service!.slug}#breadcrumb`,
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
            name: service!.title,
            item: `https://maisonblender.com/diensten/${service!.slug}`,
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
              <span className="text-[#1f1f1f]">{service!.title}</span>
            </nav>

            <div className="flex flex-col gap-4 max-w-3xl">
              <span className="text-xs font-medium uppercase tracking-widest text-[#575760]">
                {service!.subtitle}
              </span>
              <h1
                className="text-[28px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[35px] lg:text-[42px]"
                style={{ letterSpacing: "-0.95px" }}
              >
                {service!.title.includes("&") ? (
                  <>
                    {service!.title.split("&")[0].trim()}
                    <br />
                    <span className="font-exposure">&amp; {service!.title.split("&")[1].trim()}</span>
                  </>
                ) : (
                  <span className="font-exposure">{service!.title}</span>
                )}
              </h1>
              <p className="text-lg text-[#575760] max-w-xl leading-relaxed">
                {service!.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/strategiegesprek"
                  className="rounded-full bg-[#1f1f1f] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#3a3a42]"
                >
                  Gratis strategiegesprek
                </Link>
                <Link
                  href="/quickscan"
                  className="rounded-full border border-[#1f1f1f]/20 px-6 py-3 text-sm font-medium text-[#1f1f1f] transition-all hover:bg-white"
                >
                  Start gratis AI-scan
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Tags */}
        <section className="border-b border-black/[0.06] bg-white px-6 py-6">
          <div className="mx-auto max-w-6xl flex flex-wrap gap-2">
            {service!.tags.map((tag) => (
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
                className="text-[20px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px]"
                style={{ letterSpacing: "-0.5px" }}
              >
                Wat wij voor je doen
              </h2>
              {service!.longDescription.map((paragraph, i) => (
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
                  {service!.benefits.map((benefit, i) => (
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
                  Plan een gratis strategiegesprek en ontdek hoe {service!.title} je bedrijf versterkt.
                </p>
                <Link
                  href="/strategiegesprek"
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
                className="text-[20px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px]"
                style={{ letterSpacing: "-0.5px" }}
              >
                Waarvoor gebruiken onze klanten dit?
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {service!.useCases.map((useCase, i) => (
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

        {/* Track B anchor sections */}
        {service!.sections && service!.sections.length > 0 && (
          <section className="px-6 py-16 lg:py-24">
            <div className="mx-auto max-w-6xl flex flex-col gap-16">
              {service!.sections.map((section) => (
                <div key={section.id} id={section.id} className="scroll-mt-24">
                  <h2
                    className="mb-4 text-[20px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-2xl"
                    style={{ letterSpacing: "-0.5px" }}
                  >
                    {section.title}
                  </h2>
                  <p className="max-w-3xl text-[#575760] leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technologies */}
        <section className="px-6 py-12 border-b border-black/[0.06]">
          <div className="mx-auto max-w-6xl flex flex-wrap items-center gap-4">
            <span className="text-xs font-medium uppercase tracking-widest text-[#575760] mr-2">
              Technologieën:
            </span>
            {service!.technologies.map((tech) => (
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
                className="text-[20px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px]"
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
              className="text-[24px] font-normal leading-[1.2] tracking-tight sm:text-[29px] lg:text-[35px]"
              style={{ letterSpacing: "-0.95px" }}
            >
              Klaar voor{" "}
              <span className="font-exposure">{service!.title}?</span>
            </h2>
            <p className="max-w-lg text-white/70">
              Plan een gratis strategiegesprek en ontdek wat AI concreet voor je bedrijf kan betekenen.
              Geen verplichtingen, wel direct inzicht.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/strategiegesprek"
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[#1f1f1f] transition-all hover:bg-[#f2f3f5]"
              >
                Strategiegesprek inplannen
              </Link>
              <Link
                href="/quickscan"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/10"
              >
                Start gratis AI-scan
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
