import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://maisonblender.com"),
};

export default function AICollegaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className="flex-1 pt-20 outline-none">
        {children}
      </main>
      <Footer />
    </>
  );
}
