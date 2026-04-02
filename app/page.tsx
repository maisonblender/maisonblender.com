import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Sectoren from "@/components/Sectoren";
import Process from "@/components/Process";
import AIDemo from "@/components/AIDemo";
import About from "@/components/About";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col flex-1 bg-[#f2f3f5] text-[#1f1f1f]">
      <Nav />
      <Hero />
      <Services />
      <Sectoren />
      <Process />
      <div className="bg-[#080b10]">
        <AIDemo />
      </div>
      <About />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}
