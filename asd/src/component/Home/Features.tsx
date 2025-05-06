import React from "react";
import { FaShippingFast, FaGem, FaStore, FaGift, FaRegCreditCard } from "react-icons/fa";
import { RiArrowGoBackLine } from "react-icons/ri";

const features = [
  {
    icon: <FaShippingFast className="w-8 h-8 text-black" />,
    title: "Free Shipping",
  },
  {
    icon: <FaGem className="w-8 h-8 text-black" />,
    title: "100% Certified Diamonds",
  },
  {
    icon: <FaStore className="w-8 h-8 text-black" />,
    title: "Order Online, Grab In Store",
  },
  {
    icon: <RiArrowGoBackLine className="w-8 h-8 text-black" />,
    title: "Free Resizing",
  },
  {
    icon: <FaGift className="w-8 h-8 text-black" />,
    title: "Complimentary Gift Box",
  },
  {
    icon: <FaRegCreditCard className="w-8 h-8 text-black" />,
    title: "Gift Cards For Any Occasion",
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="mb-4">{feature.icon}</div>
              <p className="text-sm font-medium text-black">{feature.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
