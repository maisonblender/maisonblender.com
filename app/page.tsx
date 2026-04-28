import Nav from "@/components/Nav";
import HeroWithTriage from "@/components/HeroWithTriage";
import QuickscanBanner from "@/components/QuickscanBanner";
import Services from "@/components/Services";
import Sectoren from "@/components/Sectoren";
import BrandAmbassadorSection from "@/components/BrandAmbassadorSection";
import Process from "@/components/Process";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import HidePresenceUntilScrolledPast from "@/components/PersistentPresence/HidePresenceUntilScrolledPast";

export default function Home() {
  return (
    <>
      {/* Verbergt de site-wide Liquid Presence zolang de bezoeker nog
          niet voorbij de #brand-ambassador-sectie is gescrolld — die
          sectie heeft z'n eigen lokale Presence canvas, dus we willen
          geen twee tegelijk in beeld. Pas vanaf Process/About verschijnt
          de site-wide Presence rechtsonder. */}
      <HidePresenceUntilScrolledPast />
      <Nav />
      <main
        id="main"
        tabIndex={-1}
        className="flex flex-col flex-1 bg-[#f2f3f5] text-[#1f1f1f] outline-none"
      >
        <HeroWithTriage />
        <QuickscanBanner />
        <Services />
        <Sectoren />
        <BrandAmbassadorSection />
        <Process />
        <About />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
