// src/component/HeroSection.jsx

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination"; // Only import pagination CSS
import { Pagination, Autoplay } from "swiper/modules"; // Removed Navigation
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t } = useTranslation();

  const slides = [
    {
      title: t("hero.title1", "A Classic Elegance Gift."),
      description: t(
        "hero.description1",
        "A classic diamond gift embodies timeless elegance, making every occasion special and unforgettable for recipients."
      ),
      image: "/assets/hero/image (3).png", // Replace with your image path
    },
    {
      title: t("hero.title2", "The Perfect Engagement Ring."),
      description: t(
        "hero.description2",
        "Capture the essence of love with the perfect solitaire ring to make your special day unforgettable."
      ),
      image: "/assets/hero/01.jpg", // Replace with your image path
    },
    {
      title: t("hero.title3", "Timeless Treasures."),
      description: t(
        "hero.description3",
        "Explore a world of timeless treasures and adorn yourself with exquisite elegance."
      ),
      image: "/assets/hero/02.jpg", // Replace with your image path
    },
    {
      title: t("hero.title4", "Celebrate Every Moment."),
      description: t(
        "hero.description4",
        "Celebrate life's moments with our fine jewelry collection, designed to make memories last forever."
      ),
      image: "/assets/hero/04.jpg", // Replace with your image path
    },
  ];

  return (
    <section className="relative w-full h-[600px]">
      <Swiper
        modules={[Pagination, Autoplay]} // Removed Navigation
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }} // Keep pagination if needed
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[600px]">
              {/* Full Background Image */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  className="object-cover w-full h-full"
                  src={slide.image}
                  alt={slide.title}
                />
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              </div>

              {/* Text Content on the Left */}
              <div className="absolute inset-0 flex items-center justify-start text-left text-white z-10">
                <div className="max-w-lg px-8">
                  <p className="text-sm uppercase tracking-wide text-[#b2996e] mb-2">
                    {t("hero.subheading", "Top Trends in Solitaire Ring")}
                  </p>
                  <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-sm md:text-base text-gray-200">
                    {slide.description}
                  </p>
                  <button className="mt-6 px-6 py-2 bg-[#b2996e] text-black font-semibold rounded-lg hover:bg-[#a0845c] transition duration-300">
                    {t("hero.cta", "Explore Now")}
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Decorative Horizontal Section */}
      <div className="absolute bottom-0 w-full bg-[#fdfaf6] py-3 flex items-center justify-center text-sm text-[#4a423b]">
        <div className="flex space-x-6">
          <span>{t("hero.feature1", "Free Shipping Worldwide")}</span>
          <span>·</span>
          <span>{t("hero.feature2", "100% Certified Diamonds")}</span>
          <span>·</span>
          <span>{t("hero.feature3", "Sustainable Materials")}</span>
          <span>·</span>
          <span>{t("hero.feature4", "Complimentary Gift Wrapping")}</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;