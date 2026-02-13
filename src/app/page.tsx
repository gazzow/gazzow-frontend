import AuthNavbar from "@/components/layout/AuthNavbar";
import Community from "@/components/layout/Community";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/layout/Hero";
import Stats from "@/components/layout/Stats";

export default function Landing() {
  return (
    <>
      <AuthNavbar />
      <Hero />
      <Stats />
      <Community />
      <Footer />
    </>
  );
}
