import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import ProblemsSection from "@/components/landing/ProblemsSection";
import ModulesSection from "@/components/landing/ModulesSection";
import RolesSection from "@/components/landing/RolesSection";
import WorkflowSection from "@/components/landing/WorkflowSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <section id="features">
          <ProblemsSection />
        </section>
        <section id="modules">
          <ModulesSection />
        </section>
        <section id="roles">
          <RolesSection />
        </section>
        <WorkflowSection />
        <section id="contact">
          <CTASection />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
