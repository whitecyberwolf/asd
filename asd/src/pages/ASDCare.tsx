import React from "react";

const ASDCare = () => {
  return (
    <div className="bg-[#f9f4ef] text-black">
      {/* Hero Section */}
      <div
        className="relative w-full h-[450px] bg-cover bg-center"
        style={{ backgroundImage: "url('/images/asd-care.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center px-8 sm:px-16">
          <h1 className="text-white text-xl sm:text-3xl font-semibold uppercase tracking-wider">
            HOME &gt; ASD CARE
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-screen-lg mx-auto px-8 py-14">
        <p className="text-base sm:text-lg leading-relaxed mb-8">
          Caring for your diamond jewelry is essential to maintain its brilliance and beauty.
          Here are some simple tips to ensure your precious pieces stay in top condition:
        </p>

        {/* Regular Cleaning */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 uppercase tracking-wide">Regular Cleaning</h2>
          <ul className="list-disc pl-6 text-lg leading-loose">
            <li><strong>Gentle Cleaning Solution:</strong> Use a mild soap mixed with warm water. Avoid harsh chemicals.</li>
            <li><strong>Soft Brush:</strong> Clean with a soft toothbrush or a microfiber cloth to remove dirt and oils.</li>
            <li><strong>Rinse and Dry:</strong> Rinse thoroughly with clean water and dry with a soft cloth.</li>
          </ul>
        </div>

        {/* Safe Storage */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 uppercase tracking-wide">Safe Storage</h2>
          <ul className="list-disc pl-6 text-lg leading-loose">
            <li><strong>Separate Compartments:</strong> Store each piece in its own compartment to prevent scratches.</li>
            <li><strong>Jewelry Box:</strong> Use a padded jewelry box or soft pouches to protect your diamonds when not worn.</li>
          </ul>
        </div>

        {/* Avoid Exposure */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 uppercase tracking-wide">Avoid Exposure</h2>
          <ul className="list-disc pl-6 text-lg leading-loose">
            <li><strong>Chemicals:</strong> Keep your jewelry away from household cleaners, perfumes, and lotions, as these can damage the metal and dull the diamonds.</li>
            <li><strong>Activities:</strong> Remove jewelry before engaging in sports, swimming, or any strenuous activities to avoid damage.</li>
          </ul>
        </div>

        {/* Periodic Inspections */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 uppercase tracking-wide">Periodic Inspections</h2>
          <ul className="list-disc pl-6 text-lg leading-loose">
            <li><strong>Check Settings:</strong> Regularly inspect your jewelry for loose stones or damage. If you notice anything amiss, take it to a professional jeweler for repair.</li>
            <li><strong>Professional Cleaning:</strong> Consider having your jewelry professionally cleaned and inspected at least once a year.</li>
          </ul>
        </div>

        {/* Wear With Care */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 uppercase tracking-wide">Wear With Care</h2>
          <ul className="list-disc pl-6 text-lg leading-loose">
            <li><strong>Put On Last:</strong> Put on your jewelry after applying makeup, hair products, and perfume to minimize exposure to chemicals.</li>
            <li><strong>Avoid Heavy Wear:</strong> Limit wearing your diamond jewelry during physical activities or when handling rough materials.</li>
          </ul>
        </div>

        {/* Insurance */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 uppercase tracking-wide">Insurance</h2>
          <ul className="list-disc pl-6 text-lg leading-loose">
            <li><strong>Get Insured:</strong> Consider insuring your diamond jewelry for added peace of mind. Keep receipts and certificates in a safe place.</li>
          </ul>
        </div>

        {/* Final Note */}
        <p className="text-lg font-semibold mt-8 text-center">
          By following these care tips, you can ensure that your diamond jewelry remains as stunning as the day you bought it, allowing you to enjoy its beauty for years to come.
        </p>
      </div>
    </div>
  );
};

export default ASDCare;
