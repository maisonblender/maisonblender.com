const services = [
  {
    id: "01",
    title: "AI Chatbots & Klantenservice",
    subtitle: "24/7 geautomatiseerde klantinteractie",
    description:
      "Automatiseer tot 90% van uw klantenservice met AI-agents die vragen beantwoorden, afspraken inplannen en leads kwalificeren — via web, WhatsApp, e-mail en meer.",
    tags: ["Conversational AI", "WhatsApp & web chat", "Lead generatie", "Omnichannel"],
  },
  {
    id: "02",
    title: "AI Agents & Procesautomatisering",
    subtitle: "Intelligente agents die voor u werken",
    description:
      "Custom AI-agents die taken uitvoeren: documenten verwerken, e-mails interpreteren, acties uitvoeren in uw CRM of ERP. 24/7 operationeel, zonder menselijke tussenkomst.",
    tags: ["Multi-agent orkestratie", "Documentverwerking", "CRM/ERP-koppelingen", "Taakuitvoering"],
  },
  {
    id: "03",
    title: "RPA & Workflow-integraties",
    subtitle: "Robotic Process Automation zonder zorgen",
    description:
      "Automatiseer repetitieve schermtaken en verbind uw systemen via robuuste API-koppelingen. Van factuurverwerking tot contractbeheer — wij beheren het volledig voor u.",
    tags: ["Robotic Process Automation", "API-integraties", "Factuurverwerking", "Schermautomatisering"],
  },
  {
    id: "04",
    title: "Custom AI Software & Portalen",
    subtitle: "Maatwerksoftware aangedreven door AI",
    description:
      "Bespoke AI-applicaties, klant- en leveranciersportalen, mobiele apps en webapplicaties — volledig op maat gebouwd voor uw processen en data.",
    tags: ["Klantportalen", "Web & mobiele apps", "AI-applicaties", "Documentbeheer"],
  },
  {
    id: "05",
    title: "Data-intelligentie & Rapportages",
    subtitle: "Van ruwe data naar bruikbare inzichten",
    description:
      "RAG-systemen die uw interne kennisbase ontsluiten, automatische rapportages en dashboards die uw team dagelijks sturen op de juiste KPI's.",
    tags: ["RAG-systemen", "Kennismanagement", "Dashboards", "Automatische rapportages"],
  },
  {
    id: "06",
    title: "AI Strategie & Quickscan",
    subtitle: "Van strategie naar uitvoering",
    description:
      "Wij beginnen met een gratis automatiseringsquickscan van uw processen. U krijgt een concreet implementatieplan inclusief business case — zodat u weet wat het oplevert vóór u investeert.",
    tags: ["Gratis quickscan", "Implementatieroadmap", "Business case", "Team training"],
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
            Alles wat u nodig heeft.
            <br />
            <span className="text-[#8892a4]">Onder één dak.</span>
          </h2>
          <p className="max-w-xl text-[#8892a4]">
            Van AI-chatbots en procesautomatisering tot maatwerksoftware en dataplatformen —
            wij leveren de volledige AI-stack voor uw organisatie.
          </p>
        </div>

        <div className="grid gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-3">
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
