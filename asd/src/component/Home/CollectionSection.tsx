import React from "react";
import { Link } from "react-router-dom";

const Collection: React.FC = () => {
  const collections = [
    {
      title: "Men's Collection",
      subtitle: "Unleash your style with diamonds for men.",
      items: [
        // { name: "Watches", image: "/assets/mens/Frame 6.png", link: "/WatchesList" },
        { name: "Glasses", image: "/assets/mens/Frame 7.png", link: "/GlassesList" },
        { name: "Bracelet", image: "/assets/mens/Frame 8.png", link: "/BraceletList" },
        { name: "Chain & Pendant", image: "/assets/mens/Frame 9.png", link: "/ChainsDetails" },
        { name: "Ring", image: "/assets/mens/Frame 10.png", link: "/RingList" },
        { name: "Earring", image: "/assets/mens/Frame 11.png", link: "/EarringList" },
        { name: "Grills", image: "/assets/mens/Frame 12.png", link: "/mens/grills" },
      ],
    },
    {
      title: "Women's Collection",
      subtitle: "Dazzle every day with women's diamond pieces.",
      items: [
        // { name: "Watches", image: "/assets/womens/Frame 13.png", link: "/womens/watches" },
        { name: "Glasses", image: "/assets/womens/Frame 14.png", link: "/GlassesList" },
        { name: "Bracelet", image: "/assets/womens/Frame 15.png", link: "/BraceletList" },
        { name: "Chain & Pendant", image: "/assets/womens/Frame 16.png", link: "/ChainsDetails" },
        { name: "Necklace", image: "/assets/womens/Frame 17.png", link: "/womens/necklace" },
        { name: "Ring", image: "/assets/womens/Frame 18.png", link: "/RingList" },
        { name: "Earring", image: "/assets/womens/Frame 19.png", link: "/EarringList" },
      ],
    },
  ];

  return (
    <section className="py-32 bg-gray-50 ">
      {collections.map((collection) => (
        <div key={collection.title} className="text-center mb-20">
          {/* Subtitle */}
          <h2 className="text-gray-500 uppercase tracking-wider text-sm">
            {collection.subtitle}
          </h2>
          {/* Title */}
          <h1 className="text-3xl font-bold mt-2 text-gray-800">
            {collection.title}
          </h1>
          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 mt-12 mx-auto max-w-screen-xxl px-6">
            {collection.items.map((item) => (
              <Link to={item.link} key={item.name} className="group">
                <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-4 transition-transform transform hover:scale-105 hover:shadow-lg">
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-80 h-52 object-contain transition-transform transform group-hover:scale-110"
                  />
                  {/* Name */}
                  <p className="mt-4 text-gray-700 text-sm font-medium">
                    {item.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Collection;
