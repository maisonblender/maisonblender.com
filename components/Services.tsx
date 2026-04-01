const services = [
  {
    id: "01",
    title: "Het Brein",
    subtitle: "Large Language Models & AI-logica",
    description:
      "Wij integreren en fine-tunen LLMs voor uw specifieke domein. Van RAG-systemen die uw interne kennisbank ontsluiten tot function calling die uw bestaande software aanstuurt.",
    tags: ["LLMs & Fine-tuning", "RAG-systemen", "Function calling", "Prompt engineering"],
  },
  {
    id: "02",
    title: "Het Zenuwstelsel",
    subtitle: "Workflow-orchestratie & Infrastructuur",
    description:
      "Intelligente pipelines die uw processen met elkaar verbinden. MCP-servers, vector databases en event-driven architecturen die uw AI-agents laten samenwerken als één organisme.",
    tags: ["Workflow-orchestratie", "MCP-servers", "Vector databases", "Event-driven AI"],
  },
  {
    id: "03",
    title: "De Zintuigen & Handen",
    subtitle: "Integraties & Data-pipelines",
    description:
      "Uw AI ziet, hoort en handelt. Wij koppelen uw bestaande tech-stack aan AI via robuuste API-integraties, data-pipelines en strategisch technisch advies.",
    tags: ["API-integraties", "Data-pipelines", "Tech-stack advies", "Automatisering"],
  },
];

export default function Services() {
  return (
    <section id="diensten" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex flex-col gap-4">
          <span className="text-xs font-medium uppercase tracking-widest text-[#4af0c4]">
            Diensten
          </span>
          <h2 className="text-4xl font-black tracking-tight text-[#f0f4ff] sm:text-5xl">
            Gebouwd voor impact.
            <br />
            <span className="text-[#8892a4]">Elke laag van AI.</span>
          </h2>
          <p className="max-w-xl text-[#8892a4]">
            Wij werken van strategie tot implementatie — van het intelligente brein tot de handen
            die de uitvoering doen.
          </p>
        </div>

        <div className="grid gap-px bg-white/5 sm:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="group flex flex-col gap-6 bg-[#080b10] p-8 transition-colors hover:bg-[#0d1219]"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs text-[#4af0c4]/60">{service.id}</span>
                <div className="h-px w-8 bg-[#4af0c4]/20 transition-all group-hover:w-16 group-hover:bg-[#4af0c4]/60" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-[#f0f4ff]">{service.title}</h3>
                <p className="text-sm font-medium text-[#4af0c4]">{service.subtitle}</p>
              </div>
              <p className="flex-1 text-sm leading-relaxed text-[#8892a4]">{service.description}</p>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/5 bg-white/[0.03] px-3 py-1 text-xs text-[#8892a4]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
