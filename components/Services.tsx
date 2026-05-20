"use client";
import SiteImage from "@/components/SiteImage";
import ServiceCard from "@/components/ServiceCard";
import { services } from "@/lib/services";

export default function Services() {
  return (
    <section id="diensten" className="relative px-6 py-20 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex flex-col gap-4">
          <span className="text-xs font-medium uppercase tracking-widest text-[#575760]">
            Diensten
          </span>
          <h2 className="text-[24px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] sm:text-[29px] lg:text-[26px]" style={{ letterSpacing: "-0.95px" }}>
            Van eerste gesprek tot live systeem
            <br />
            <span className="font-exposure">— en daarna.</span>
          </h2>
          <p className="max-w-xl text-[#575760]">
            Sommige bureaus adviseren. Anderen bouwen. Wij doen het hele traject: procesanalyse,
            bouw, lancering en beheer. Jij hoeft alleen de resultaten te zien.
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
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
