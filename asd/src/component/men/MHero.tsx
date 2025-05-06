import React from 'react';

interface HeroProps {
  title: string;
  subtitle: string;
  breadcrumb: string[];
  bgImage: string;
}

export const Hero: React.FC<HeroProps> = ({ title, subtitle, breadcrumb, bgImage }) => (
  <section className="relative bg-black text-white">
    <img src={bgImage} alt="Banner" className="w-full h-96 object-cover opacity-70" />
    <div className="absolute inset-0 flex flex-col justify-center px-8">
      <nav className="text-sm mb-2">
        {breadcrumb.map((crumb, idx) => (
          <span key={idx}>
            {idx > 0 && <span className="mx-2">&gt;</span>}
            {idx < breadcrumb.length - 1 ? (
              <a href={`/${crumb.toLowerCase().replace(/\s+/g, '-')}`} className="text-yellow-600">
                {crumb.toUpperCase()}
              </a>
            ) : (
              <span>{crumb.toUpperCase()}</span>
            )}
          </span>
        ))}
      </nav>
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="mt-2 max-w-lg">{subtitle}</p>
    </div>
  </section>
);