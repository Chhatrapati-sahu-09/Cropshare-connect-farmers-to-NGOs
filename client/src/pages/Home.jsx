import React from "react";

// 1. Import all the new components
import HeroSection from "../components/home/HeroSection.jsx";
import StatsSection from "../components/home/StatsSection.jsx";
import FeaturesSection from "../components/home/FeaturesSection.jsx";
import ProblemSolutionSection from "../components/home/ProblemSolutionSection.jsx";
import HowItWorksSection from "../components/home/HowItWorksSection.jsx";
import TestimonialsSection from "../components/home/TestimonialsSection.jsx";
import CTASection from "../components/home/CTASection.jsx";

// 2. Import the shared stylesheet
import "../components/home/Home.css";

const Home = () => {
  return (
    <div className="page-container">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <ProblemSolutionSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default Home;
