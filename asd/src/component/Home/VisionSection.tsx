import React from "react";

const visionCards = [
  {
    title: "OUR COMMITMENT",
    subtitle: "To Offer Elegant, Sustainable & Timeless Jewellery for Life.",
    image: "/assets/image.png", // Replace with your image path
    link: "#commitment",
    gridArea: "commitment", // Specify grid area
  },
  {
    title: "OUR STORY",
    subtitle: "The Shine that Inspires AprilShine Jewellery.",
    image: "/assets/Mask group.png", // Replace with your image path
    link: "#story",
    gridArea: "story", // Specify grid area
  },
  {
    title: "OUR BLOGS",
    subtitle: "Your Ultimate Guide.",
    image: "/assets/image 38.png", // Replace with your image path
    link: "#blogs",
    gridArea: "blogs", // Specify grid area
  },
];

const VisionSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-black">OUR VISION AND INSIGHTS...</h2>
          <a
            href="#all-posts"
            className="text-sm text-[#9c7a56] hover:underline transition"
          >
            See All Posts →
          </a>
        </div>

        {/* Grid Layout */}
        <div
          className="grid gap-6"
          style={{
            gridTemplateAreas: `
              "commitment commitment story"
              "commitment commitment blogs"
            `,
            gridTemplateColumns: "2fr 1fr",
            gridTemplateRows: "auto",
          }}
        >
          {visionCards.map((card, index) => (
            <a
              key={index}
              href={card.link}
              className={`relative rounded-lg overflow-hidden group`}
              style={{
                gridArea: card.gridArea,
              }}
            >
              {/* Background Image */}
              <img
                src={card.image}
                alt={card.subtitle}
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition duration-500 ease-in-out"></div>

              {/* Text Content */}
              <div className="absolute bottom-6 left-6 text-white transition-all duration-500 ease-in-out group-hover:bottom-8">
                <p className="text-sm font-semibold opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                  {card.title}
                </p>
                <h3 className="text-lg font-bold mt-1 opacity-90 group-hover:opacity-100 transition-opacity duration-500">
                  {card.subtitle}
                </h3>
              </div>

              {/* Arrow Icon */}
              <div className="absolute bottom-6 right-6 text-white transition-all duration-500 ease-in-out group-hover:right-8">
                <span className="flex items-center justify-center w-8 h-8 bg-white text-black rounded-full group-hover:bg-[#9c7a56] group-hover:text-white transition">
                  →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
