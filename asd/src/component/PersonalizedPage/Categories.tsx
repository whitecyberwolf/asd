import React from "react";

const categories = [
  { name: "Rings", image: "/images/categories/rings.jpg" },
  { name: "Necklaces", image: "/images/categories/necklaces.jpg" },
  { name: "Bracelets", image: "/images/categories/bracelets.jpg" },
  { name: "Earrings", image: "/images/categories/earrings.jpg" },
];

const Categories: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-screen-xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">
          Discover Your Style
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-lg shadow-lg"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-300">
                <span className="text-lg font-semibold">{category.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
