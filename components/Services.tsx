"use client";
import Link from "next/link";
import SiteImage from "@/components/SiteImage";
import { services } from "@/lib/services";
import { tagUrlMap } from "@/lib/tag-pages";

export default function Services() {
  return (
    <section id="diensten" className="relative px-6 py-20 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex flex-col gap-4">
          <span className="text-xs font-medium uppercase tracking-widest text-[#575760]">
            Diensten
          </span>
          <h2 className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[26px]" style={{ letterSpacing: "-0.95px" }}>
            Van AI Impact Scan tot live systeem.
            <br />
            <span className="font-exposure">Alles in eigen handen.</span>
          </h2>
          <p className="max-w-xl text-[#575760]">
            Sommige bureaus adviseren. Anderen bouwen. Wij doen alles: van het eerste gesprek
            over je processen tot het beheer van de AI-agents die eruit voortkomen.
          </p>
        </div>

        <div className="mb-12 overflow-hidden">
          <SiteImage
            src="/images/services-flow.png"
            alt="Diensten overzicht flow"
            className="object-cover w-full max-h-64"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/diensten/${service.slug}`}
              className="group flex flex-col gap-6 bg-white p-6 transition-colors hover:bg-[#ecedf0] sm:p-8"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs text-[#575760]/60">{service.id}</span>
                <div className="h-px w-8 bg-black/20 transition-all group-hover:w-16 group-hover:bg-black/40" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-[#1f1f1f]">{service.title}</h3>
                <p className="text-sm font-medium text-[#575760]">{service.subtitle}</p>
              </div>
              <p className="flex-1 text-sm leading-relaxed text-[#575760]">{service.description}</p>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => {
                  const href = tagUrlMap[tag];
                  return href ? (
                    <Link
                      key={tag}
                      href={href}
                      onClick={(e) => e.stopPropagation()}
                      className="border border-black/[0.08] bg-white px-3 py-1 text-xs text-[#575760] hover:bg-[#f2f3f5] hover:border-black/20 transition-colors"
                    >
                      {tag}
                    </Link>
                  ) : (
                    <span
                      key={tag}
                      className="border border-black/[0.08] bg-white px-3 py-1 text-xs text-[#575760]"
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
