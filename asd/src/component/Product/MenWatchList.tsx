import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Hero } from '../men/MHero';
import { Filters } from '../Filters';
import { Toolbar } from '../Toolbar';
import { ProductCard } from '../ProductCard';
import { Pagination } from '../Pagination';

const MenWatchList = () => {
  interface WatchItem {
    _id: string;
    name: string;
    images: string[];
    price: {
      sale: number;
      original: number;
    };
    discountLabel?: string;
  }

  const [items, setItems] = useState<WatchItem[]>([]);

  useEffect(() => {
    interface ApiResponse {
      _id: string;
      name: string;
      images: string[];
      discountedPrice?: number;
      originalPrice: number;
      sizes: { price: number }[];
      discountLabel?: string;
    }

    api.get('/men-watches').then(res => {
      setItems(res.data.map((w: ApiResponse) => ({
        _id: w._id,
        name: w.name,
        images: w.images,
        price: {
          sale: w.discountedPrice ?? w.sizes[0]?.price,
          original: w.originalPrice
        },
        discountLabel: w.discountLabel,
      })));
    });
  }, []);

  return (
    <div className="bg-white">
      <Hero
        title="Men’s Watches"
        subtitle="Luxury for every style—custom diamond men’s watches to match your budget."
        breadcrumb={["Home", "Men’s Watches"]}
        bgImage="/images/men-hero.jpg"
      />
      <div className="container mx-auto flex py-8">
        <Filters />
        <div className="flex-1 pl-8">
          <Toolbar total={items.length} />
          <div className="grid grid-cols-4 gap-6">
            {items.map(item => (
              <ProductCard
                key={item._id}
                category="men"
                id={item._id}
                name={item.name}
                image={item.images[0]}
                price={item.price.sale}
                original={item.price.original}
                badge={item.discountLabel}
                to={`/product/${item._id}`}
              />
            ))}
          </div>
          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default MenWatchList;
