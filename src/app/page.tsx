import AuthNavbar from "@/components/layout/AuthNavbar";
import Benefits from "@/components/layout/Benefits";
import Community from "@/components/layout/Community";
import Features from "@/components/layout/Features";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/layout/Hero";
import HowItWorks from "@/components/layout/HowItsWork";
import Stats from "@/components/layout/Stats";
import WhyGazzow from "@/components/layout/WhyGazzow";

export default function Landing() {
  return (
    <>
      <AuthNavbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <WhyGazzow />
      <Benefits />
      <Community />
      <Footer />
    </>
  );
}
