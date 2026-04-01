import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col flex-1 bg-[#080b10] text-[#f0f4ff]">
      <Nav />
      <Hero />
      <Services />
      <Process />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
