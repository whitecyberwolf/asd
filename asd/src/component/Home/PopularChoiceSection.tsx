import React from 'react';

interface Item {
  name: string;
  image: string;
  price: string;
  salePrice?: string;
}

const PopularChoice: React.FC = () => {
  const items: Item[] = [
    {
      name: '10K Gold Diamond Jesus Pendant',
      image: '/images/jesus-pendant.png',
      price: '$440.00',
    },
    {
      name: '10K Solid Gold Rope Chain',
      image: '/images/gold-rope-chain.png',
      price: '$1,350.00',
    },
    {
      name: 'AP Skeleton Two Tone Moissanite Watch',
      image: '/images/skeleton-watch.png',
      price: '$1,350.00',
      salePrice: '$1,600.00',
    },
    {
      name: 'Black Diamond Tennis Necklace',
      image: '/images/diamond-tennis-necklace.png',
      price: '$1,850.00',
    },
    {
      name: '14K Gold Diamond Ring For Men',
      image: '/images/gold-diamond-ring.png',
      price: '$655.00',
    },
  ];

  return (
    <section className="py-16 bg-white text-center">
      <h1 className="text-3xl font-semibold text-gray-800 mb-12">Popular Choice</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-screen-xl mx-auto">
        {items.map((item) => (
          <div key={item.name} className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-md p-4">
            <img src={item.image} alt={item.name} className="w-40 h-40 object-contain mb-4" />
            <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
            <p className="text-sm text-gray-500 mt-2">{item.price}</p>
            {item.salePrice && (
              <p className="text-sm text-red-500 line-through mt-2">{item.salePrice}</p>
            )}
            <button className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularChoice;
