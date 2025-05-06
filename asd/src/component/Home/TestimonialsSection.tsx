import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

const testimonials = [
  {
    name: "Michael C.",
    image: "/images/testimonial1.jpg", // Replace with your image path
    review:
      "Helpful, informative, and affordable, Clean Origin is the place to go for my Cuban chain.",
    rating: 5,
  },
  {
    name: "Champo M.",
    image: "/images/testimonial2.jpg", // Replace with your image path
    review:
      "The tennis necklace is AMAZING. It's an eye-catcher for everyone. Extremely well made and I very love it.",
    rating: 5,
  },
  {
    name: "Alex O.",
    image: "/images/testimonial3.jpg", // Replace with your image path
    review:
      "Thank you for giving us everything we were looking for to make the absolute perfect chain!",
    rating: 5,
  },
  {
    name: "Emily R.",
    image: "/images/testimonial4.jpg", // Replace with your image path
    review:
      "I absolutely love my diamond bracelet! It's stunning and exactly what I was looking for.",
    rating: 5,
  },
  {
    name: "James T.",
    image: "/images/testimonial5.jpg", // Replace with your image path
    review:
      "Fantastic customer service and top-quality jewellery. I’ll definitely be coming back!",
    rating: 5,
  },
  {
    name: "Sophia L.",
    image: "/images/testimonial6.jpg", // Replace with your image path
    review:
      "The engagement ring was everything I dreamed of and more. Perfect craftsmanship!",
    rating: 5,
  },
  {
    name: "Oliver H.",
    image: "/images/testimonial7.jpg", // Replace with your image path
    review:
      "I purchased a gold chain and was amazed by the quality and shine. Highly recommend!",
    rating: 5,
  },
  {
    name: "Isabella P.",
    image: "/images/testimonial8.jpg", // Replace with your image path
    review:
      "This jewellery store is a gem! I’ve never been more satisfied with a purchase.",
    rating: 5,
  },
  {
    name: "Ethan W.",
    image: "/images/testimonial9.jpg", // Replace with your image path
    review:
      "The diamond necklace I bought was breathtaking. Amazing service and quality!",
    rating: 5,
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 text-center">
        {/* Section Header */}
        <h2 className="text-2xl font-bold text-black mb-6">TESTIMONIALS</h2>
        <div className="flex justify-center mb-8">
          <div className="w-20 h-1 bg-[#9c7a56]"></div>
        </div>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="p-6 border rounded-lg shadow-md">
                {/* Image */}
                <div className="mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mx-auto object-cover"
                  />
                </div>
                {/* Name */}
                <h3 className="font-bold text-lg text-black mb-2">
                  {testimonial.name}
                </h3>
                {/* Rating */}
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-lg">★</span>
                  ))}
                </div>
                {/* Review */}
                <p className="text-sm text-gray-600">{testimonial.review}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonialsSection;
