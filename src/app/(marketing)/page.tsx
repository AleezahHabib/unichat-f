import * as React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/features/landing/components/Navbar";
import { Hero } from "@/features/landing/components/Hero";
import { PlatformStrip } from "@/features/landing/components/PlatformStrip";
import { HowItWorks } from "@/features/landing/components/HowItWorks";
import { FeatureGrid } from "@/features/landing/components/FeatureGrid";
import { AssistantShowcase } from "@/features/landing/components/AssistantShowcase";
import { IntegrationsHub } from "@/features/landing/components/IntegrationsHub";
import { Faq } from "@/features/landing/components/Faq";
import { FinalCta } from "@/features/landing/components/FinalCta";
import { Footer } from "@/features/landing/components/Footer";

export const metadata: Metadata = {
  title: "UniChat | Unified Team Chat & Grounded AI Intelligence",
  description:
    "One place for your team's conversations. Linked to Slack and Discord, with a Gemini AI assistant that answers with cited source messages.",
  openGraph: {
    title: "UniChat | Chat. Connect. Ask.",
    description:
      "Unified team chat connected to Slack and Discord with Gemini AI assistance.",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "UniChat Platform Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UniChat | Chat. Connect. Ask.",
    description:
      "Unified team chat connected to Slack and Discord with Gemini AI assistance.",
    images: ["/og.svg"],
  },
};

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <PlatformStrip />
        <HowItWorks />
        <FeatureGrid />
        <AssistantShowcase />
        <IntegrationsHub />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
