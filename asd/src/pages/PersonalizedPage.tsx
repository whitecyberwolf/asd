import React from "react";
import HeroSection from "../component/PersonalizedPage/HeroSection";
import Categories from "../component/PersonalizedPage/Categories";
import PersonalizedContent from "../component/PersonalizedPage/PersonalizedContent";
import CustomizeProcess from "../component/PersonalizedPage/CustomizeProcess";

const PersonalizedPage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection/>

      {/* Categories */}
      <Categories />

      {/* Featured Products */}
      <PersonalizedContent />

      {/* Testimonials */}
      <CustomizeProcess />
    </div>
  );
};

export default PersonalizedPage;
