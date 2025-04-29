import React from "react";

const HeroSection: React.FC = () => {
    return (
        <section
          className="relative w-full h-[500px] bg-cover bg-center flex items-center"
          style={{
            backgroundImage: `url('https://your-image-path.jpg')`, // Replace with the actual image path
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
    
          {/* Content */}
          <div className="relative z-10 max-w-screen-xl mx-auto px-6 text-white">
            {/* Breadcrumb */}
            <p className="text-sm text-[#c8ad97] mb-4">
              <span>HOME</span> &gt; <span>PERSONALIZED</span>
            </p>
    
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              We Honor Creativity
            </h1>
    
            {/* Description */}
            <p className="text-base md:text-lg text-gray-300 mb-6">
              We believe true beauty comes from expressing your unique style. We're
              excited to help you create beautiful pieces that reflect who you are
              and highlight the artistry in each design.
            </p>
    
            {/* Call-to-Action Button */}
            <button className="px-6 py-3 bg-[#c8ad97] text-black font-semibold rounded-md hover:bg-[#b2996e] transition duration-300">
              Start Shaping
            </button>
          </div>
        </section>
      );
};

export default HeroSection;
