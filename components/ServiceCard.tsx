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
  return (
    <article className="group flex flex-col bg-white transition-colors hover:bg-[#ecedf0]">
      <a
        href={`/diensten/${slug}`}
        className="flex flex-col gap-6 p-6 pb-4 no-underline text-inherit sm:p-8 sm:pb-5"
      >
        <div className="flex items-start justify-between">
          <span className="font-mono text-xs text-[#575760]/60">{id}</span>
          <div className="h-px w-8 bg-black/20 transition-all group-hover:w-16 group-hover:bg-black/40" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-[#1f1f1f]">{title}</h3>
          <p className="text-sm font-medium text-[#575760]">{subtitle}</p>
        </div>
        <p className="flex-1 text-sm leading-relaxed text-[#575760]">{description}</p>
      </a>
      <div className="flex flex-wrap gap-2 px-6 pb-6 sm:px-8 sm:pb-8">
        {tags.map((tag) => {
          const href = tagUrlMap[tag];
          return href ? (
            <a
              key={tag}
              href={href}
              className="border border-black/[0.08] bg-white px-3 py-1 text-xs text-[#575760] hover:bg-[#f2f3f5] hover:border-black/20 transition-colors"
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
