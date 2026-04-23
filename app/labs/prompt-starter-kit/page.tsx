import type { Metadata } from "next";
import PromptStarterKitClient from "./PromptStarterKitClient";

export const metadata: Metadata = {
  title: "Prompt Starter Kit",
  description:
    "15+ kant-en-klare AI-prompts voor klantenservice, marketing, financiën, HR en juridisch — gratis te downloaden voor Limburgse ondernemers.",
  alternates: { canonical: "https://maisonblender.com/labs/prompt-starter-kit" },
  openGraph: {
    title: "Prompt Starter Kit | Limburg AI Labs",
    description: "Kant-en-klare prompts voor je favoriete AI-tool.",
    url: "https://maisonblender.com/labs/prompt-starter-kit",
  },
};

export default function PromptStarterKitPage() {
  return <PromptStarterKitClient />;
}
