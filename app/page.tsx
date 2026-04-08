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

export default function Home() {
  return (
    <main className="flex flex-col flex-1 bg-[#f2f3f5] text-[#1f1f1f]">
      <Nav />
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
      <Footer />
    </main>
  );
}
