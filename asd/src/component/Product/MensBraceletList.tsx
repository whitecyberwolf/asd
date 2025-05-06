import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartIcon } from '@radix-ui/react-icons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { api } from '../../lib/api';

gsap.registerPlugin(ScrollTrigger);

/* ───── Types ──────────────────────────────────────────────── */
interface Variant { label: string; price: number }
interface Product {
  _id: string;
  name: string;
  images: string[];
  price?: number;
  sizes?: Variant[];
  metalTypes?: Variant[];
  diamondTypes?: Variant[];
  metalColors?: Variant[];
}

/* ───── Helpers ────────────────────────────────────────────── */
const priceOf = (p: Product) => {
  if (Number.isFinite(p.price)) return p.price as number;

  const nums = [
    ...(p.sizes        ?? []),
    ...(p.metalTypes   ?? []),
    ...(p.diamondTypes ?? []),
    ...(p.metalColors  ?? []),
  ]
    .map(v => Number(v.price))
    .filter(n => Number.isFinite(n));

  return nums.length ? Math.min(...nums) : NaN;
};

/* ───── Component ──────────────────────────────────────────── */
export default function MensBraceletList() {
  const CATEGORY = "Men's bracelet";
  const nav      = useNavigate();

  const [items,   setItems]   = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  /* Fetch bracelets once on mount */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get('/products', {
          params: { category: CATEGORY },
        });
        if (mounted) setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Fetch error:', err);
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  /* GSAP fade‑in once data is ready */
  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.product-card');
    if (cards.length === 0) return;

    gsap.from(cards, {
      opacity: 0,
      y: 40,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: gridRef.current,
        start: 'top bottom-=100',
      },
    });
  }, [items]);

  /* ─── Render states ───────────────────── */
  if (loading)          return <p className="text-center py-20">Loading…</p>;
  if (items.length === 0) return <p className="text-center py-20">No bracelets found.</p>;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Men&rsquo;s Bracelets</h1>

      <div
        ref={gridRef}
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {items.map(p => {
          const img = p.images?.[0]
            ? `/uploads/${p.images[0]}`
            : '/placeholder.jpg';

          return (
            <div
              key={p._id}
              className="product-card relative bg-white border rounded shadow hover:shadow-lg cursor-pointer"
              onClick={() => nav(`/product/${p._id}`)}
            >
              <img
                src={img}
                alt={p.name}
                className="w-full h-60 object-cover"
              />

              {/* wishlist icon */}
              <HeartIcon className="absolute top-2 right-2 text-gray-300 hover:text-red-500" />

              <div className="p-4 space-y-1">
                <h3 className="text-xs uppercase text-gray-400">Aprilshine Diamond</h3>

                <h2 className="font-semibold text-lg text-gray-800 line-clamp-2 h-12">
                  {p.name}
                </h2>

                <span className="text-yellow-700 font-bold">
                  {Number.isFinite(priceOf(p))
                    ? `₹${priceOf(p).toLocaleString()}`
                    : 'Price on request'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
