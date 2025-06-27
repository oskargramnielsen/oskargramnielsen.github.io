
import Header from '@/components/layout/header';
import HeroSection from '@/components/sections/hero-section';
import SkillsSection from '@/components/sections/skills-section';
import ProjectSection from '@/components/sections/project-section';
import CollaborationSection from '@/components/sections/collaboration-section';
import ContactSection from '@/components/sections/contact-section';
import Footer from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen"> {/* Removed bg-background to allow body gradient to show */}
      <Header />
      <main className="flex-grow container mx-auto px-2 sm:px-6 lg:px-8 py-8">
        <HeroSection />
        <SkillsSection />
        <ProjectSection /> 
        {/* <CollaborationSection />  */}
        <ContactSection /> 
      </main>
      <Footer />
    </div>
  );
}
