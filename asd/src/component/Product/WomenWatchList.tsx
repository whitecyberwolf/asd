/*  ───────────────────────────────────────────────
    src/component/Product/WomenWatchList.tsx
   ─────────────────────────────────────────────── */

   import React, { useEffect, useState } from 'react';
   import api from '../../lib/api';
   import { Hero } from '../men/MHero';
   import { Filters } from '../Filters';
   import { Toolbar } from '../Toolbar';
   import { ProductCard } from '../ProductCard';
   import { Pagination } from '../Pagination';
   
   interface PriceOption { label: string; price: number }
   interface WatchItem {
     _id: string;
     name: string;
     images: string[];
     sizes: PriceOption[];
     discountedPrice?: number;
     originalPrice?: number;
     discountLabel?: string;
   }
   
   /* ---------- Component ---------- */
   const WomenWatchList: React.FC = () => {
     const [items, setItems] = useState<WatchItem[]>([]);
     const [loading, setLoading] = useState(true);
   
     /* Fetch on mount */
     useEffect(() => {
       api
         .get('/women-watches')
         .then((res) => {
           const clean: WatchItem[] = res.data
             .map((w: any) => {
               /* basic validation & price */
               const sale =
                 w.discountedPrice ??
                 (Array.isArray(w.sizes) && w.sizes.length > 0
                   ? w.sizes[0].price
                   : null);
               if (!w._id || !w.name || !sale || !w.images?.[0]) return null;
   
               return {
                 _id: w._id,
                 name: w.name,
                 images: w.images,
                 sizes: w.sizes,
                 discountedPrice: sale,
                 originalPrice: w.originalPrice,
                 discountLabel: w.discountLabel,
               };
             })
             .filter((x: WatchItem | null): x is WatchItem => x !== null);
   
           setItems(clean);
         })
         .catch((err) => console.error('Fetch women watches failed', err))
         .finally(() => setLoading(false));
     }, []);
   
     if (loading) return <p className="p-10 text-center">Loading…</p>;
   
     return (
       <div className="bg-white">
         <Hero
           title="Women’s Watches"
           subtitle="Elegant diamond watches crafted for her style and grace."
           breadcrumb={['Home', 'Women’s Watches']}
           bgImage="/images/women-hero.jpg"
         />
   
         <div className="container mx-auto flex py-8">
           {/* Sidebar filters */}
           <Filters />
   
           {/* Product grid */}
           <div className="flex-1 pl-8">
             <Toolbar total={items.length} />
   
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {items.map((p) => (
                 <ProductCard
                   key={p._id}
                   category="women"
                   id={p._id}
                   name={p.name}
                   image={p.images[0]}
                   price={p.discountedPrice!}
                   original={p.originalPrice}
                   badge={p.discountLabel}
                   to={`/women-watches/${p._id}`}
                 />
               ))}
             </div>
   
             <Pagination />
           </div>
         </div>
       </div>
     );
   };
   
   export default WomenWatchList;
   