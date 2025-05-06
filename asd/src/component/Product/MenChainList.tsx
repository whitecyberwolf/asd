// src/pages/chains/MenChainList.tsx

import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Hero } from '../men/MHero';
import { Filters } from '../Filters';
import { Toolbar } from '../Toolbar';
import { ProductCard } from '../../component/ProductCard';
import { Pagination } from '../Pagination';
import { ChainCard } from "../../component/ChainCard";


interface ChainItem {
  _id: string;
  name: string;
  images: string[];
  price: number;
  originalPrice?: number;
  discountLabel?: string;
}

const MenChainList: React.FC = () => {
  const [items, setItems] = useState<ChainItem[]>([]);

  useEffect(() => {
    api.get('/men-chains').then(res => {
      const clean = res.data.map((w: any) => ({
        _id: w._id,
        name: w.name,
        images: w.images,
        // Use discountedPrice or first size
        price: w.discountedPrice ?? w.sizes[0]?.price,
        originalPrice: w.originalPrice,
        discountLabel: w.discountLabel
      }));
      setItems(clean);
    });
  }, []);

  return (
    <div className="bg-white">
      <Hero
        title="Men’s Chains"
        subtitle="Bold, elegant chains crafted to perfection."
        breadcrumb={['Home','Men’s Chains']}
        bgImage="/images/men-chains-hero.jpg"
      />

      <div className="container mx-auto flex py-8">
        <Filters />

        <div className="flex-1 pl-8">
          <Toolbar total={items.length} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {items.map(i => (
  <ChainCard
    key={i._id}
    category={"men"}
    id={i._id}
    name={i.name}
    image={i.images[0]}
    price={i.price}
    original={i.originalPrice}
    badge={i.discountLabel}
  />
            ))}
          </div>
          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default MenChainList;
