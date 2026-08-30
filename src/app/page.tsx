import { getSessionUser } from "@/lib/auth/session";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { HeroSection } from "@/components/marketing/HeroSection";
import { IntegrationsSection } from "@/components/marketing/IntegrationsSection";
import { HowItWorksSection } from "@/components/marketing/HowItWorksSection";
import { FeaturesSection } from "@/components/marketing/FeaturesSection";
import { ShowcaseSection } from "@/components/marketing/ShowcaseSection";
import { PricingSection } from "@/components/marketing/PricingSection";
import { FAQSection } from "@/components/marketing/FAQSection";
import { CTASection } from "@/components/marketing/CTASection";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export default async function HomePage() {
  const user = await getSessionUser();

  return (
    <div className="min-h-screen bg-white">
      <MarketingNav isLoggedIn={Boolean(user)} />
      <main>
        <HeroSection isLoggedIn={Boolean(user)} />
        <IntegrationsSection />
        <HowItWorksSection />
        <FeaturesSection />
        <ShowcaseSection />
        <PricingSection />
        <FAQSection />
        <CTASection isLoggedIn={Boolean(user)} />
      </main>
      <MarketingFooter />
    </div>
  );
}
