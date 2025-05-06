// src/pages/Home.tsx
import React from "react";
import HeroSection from "../component/Home/HeroSection"; // Adjust import path as needed
import NavBar from "../component/navbar";
import CollectionSection from "../component/Home/CollectionSection";
import PopularChoiceSection from "../component/Home/PopularChoiceSection";
import Features from "../component/Home/Features";
import VisionSection from "../component/Home/VisionSection";
import TestimonialsSection from "../component/Home/TestimonialsSection";

const Home: React.FC = () => {
  return (
    <main className="flex-grow bg-gray-50">
 <div>
      {/* <NavBar /> */}
      <HeroSection />
      <CollectionSection />
      {/* <PopularChoiceSection/> */}
      <Features/>
      <VisionSection/>
      <TestimonialsSection/>
      </div>
    </main>
  );
};

export default Home;
