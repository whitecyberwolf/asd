import React from "react";

const AboutUs = () => {
  return (
    <div className="bg-[#ffffff] text-black">
      {/* Hero Section */}
      <div
        className="relative w-full h-[400px] bg-cover bg-center"
        style={{ backgroundImage: "url('/images/about-us.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center px-6 sm:px-10">
          <h1 className="text-white text-lg sm:text-2xl font-semibold">
            HOME &gt; ABOUT ASD
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-screen-lg mx-auto px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">
          Welcome to AprilShine Diamond!
        </h2>

        <p className="text-sm sm:text-base mb-4">
          At AprilShine Diamond, we are passionate about creating exquisite diamond jewellery that reflects your unique style and personality. Established in 2015, we began our journey by cutting and polishing natural diamonds, respecting our craftsmanship and expertise in the art of diamond creation.
        </p>

        <p className="text-sm sm:text-base mb-4">
          In 2018, we expanded our vision to include the manufacturing of stunning diamond jewellery. Our mission is to provide our customers with beautifully crafted pieces that not only enhance their individual style but also create lasting memories. We believe that every piece of jewellery should be as unique as the person wearing it.
        </p>

        <p className="text-sm sm:text-base mb-4">
          Sourcing our rough diamonds primarily from Australia and Africa, we ensure that each gem is of the highest quality. Our state-of-the-art factory in Surat, Gujarat, India, is where we cut, polish, and bring these diamonds to life, transforming them into timeless treasures.
        </p>

        <p className="text-sm sm:text-base mb-4">
          At AprilShine Diamond, we prioritize quality and authenticity. For diamonds ranging from 0.8mm to 4.00mm, we provide jewellery certificates, while diamonds over 4.00mm come with GIA certification, giving you peace of mind in your purchase.
        </p>

        <p className="text-sm sm:text-base">
          We invite you to explore our collection and discover the perfect piece that resonates with you. Join us on this sparkling journey, where elegance meets individuality, and let AprilShine Diamond help you shine bright.
        </p>

        <p className="text-sm sm:text-base font-semibold mt-6">
          Thank you for choosing us to be a part of your story!
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
