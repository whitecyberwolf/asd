import React from "react";

const CustomizeProcess: React.FC = () => {
  const steps = [
    {
      title: "Design Selection and Submission",
      description:
        "Start your journey by selecting a custom piece that reflects your style. Fill out the form, and we will present, discuss, and finalize design ideas together.",
      image: "/images/customize/design-selection.jpg", // Replace with actual path
      icon: "🖌️", // You can replace this with an icon or SVG
    },
    {
      title: "Defining Budget",
      description:
        "Take a moment to sit down and create a budget to see what makes financial sense. Planning is key when it comes to any major purchase, especially one that could be life-changing.",
      image: "/images/customize/budget.jpg",
      icon: "💰",
    },
    {
      title: "Deposit Paying the Diamond",
      description:
        "It's time to kick things into gear and take your commitment up a notch by making the deposit. This deposit initiates the process of crafting a custom piece made just for you.",
      image: "/images/customize/deposit.jpg",
      icon: "💎",
    },
    {
      title: "Render Approval",
      description:
        "We'll provide 3D images of the design and make any adjustments you request. Once you approve the design based on the 3D visuals, we'll move forward with production.",
      image: "/images/customize/render.jpg",
      icon: "📐",
    },
    {
      title: "Crafting Design",
      description:
        "The creative energy of AprilShine Diamond works tirelessly to bring your vision to life. We'll refine every detail until it matches your idea of perfection.",
      image: "/images/customize/crafting.jpg",
      icon: "🔨",
    },
    {
      title: "Collection",
      description:
        "Get ready to embrace your stunning, long-awaited piece. As you leave AprilShine Diamond, you're stepping into the beginning of your own happily ever after.",
      image: "/images/customize/collection.jpg",
      icon: "🎁",
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-screen-xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          HOW WE CUSTOMIZE YOUR JEWELLERY
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Timeline */}
          <div className="relative">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start mb-12">
                {/* Icon */}
                <div className="flex-shrink-0 w-10 h-10 bg-[#fdfaf6] text-[#9c7a56] rounded-full flex items-center justify-center font-bold text-xl">
                  {step.icon}
                </div>

                {/* Text Content */}
                <div className="ml-6">
                  <h3 className="text-lg font-semibold text-[#4a423b]">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mt-2">{step.description}</p>
                </div>
              </div>
            ))}
            {/* Timeline line */}
            <div className="absolute left-5 top-0 h-full border-l-2 border-gray-200"></div>
          </div>

          {/* Images */}
          <div className="grid grid-rows-6 gap-4">
            {steps.map((step, index) => (
              <img
                key={index}
                src={step.image}
                alt={step.title}
                className="w-full h-28 md:h-40 object-cover rounded-lg shadow-sm"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomizeProcess;
