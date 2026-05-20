"use client";

import { tagUrlMap } from "@/lib/tag-pages";

interface ServiceCardProps {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
}

export default function ServiceCard({
  id,
  slug,
  title,
  subtitle,
  description,
  tags,
}: ServiceCardProps) {
  const serviceHref = `/diensten/${slug}`;

  function openService() {
    window.location.assign(serviceHref);
  }

  return (
    <article
      className="group relative flex cursor-pointer flex-col gap-6 bg-white p-6 transition-colors hover:bg-[#ecedf0] sm:p-8"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) return;
        openService();
      }}
      onKeyDown={(e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        if ((e.target as HTMLElement).closest("a")) return;
        e.preventDefault();
        openService();
      }}
      role="link"
      tabIndex={0}
      aria-label={title}
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <span className="font-mono text-xs text-[#575760]/60">{id}</span>
          <div className="h-px w-8 bg-black/20 transition-all group-hover:w-16 group-hover:bg-black/40" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-[#1f1f1f]">{title}</h3>
          <p className="text-sm font-medium text-[#575760]">{subtitle}</p>
        </div>
        <p className="flex-1 text-sm leading-relaxed text-[#575760]">{description}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const href = tagUrlMap[tag];
          return href ? (
            <a
              key={tag}
              href={href}
              className="relative z-[1] border border-black/[0.08] bg-white px-3 py-1 text-xs text-[#575760] hover:bg-[#f2f3f5] hover:border-black/20 transition-colors"
            >
              {tag}
            </a>
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
    </article>
  );
}
