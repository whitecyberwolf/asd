// src/pages/chains/ChainDetail.tsx

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import api from '../../lib/api';
import { useCart } from '../../contexts/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { ProductCard } from '../../component/ProductCard';

//////////////////////
// Types
//////////////////////
interface PriceOption { label: string; price: number }
interface Chain {
  _id: string;
  name: string;
  images: string[];
  videos?: string[];
  sizes: PriceOption[];
  metalTypes: PriceOption[];
  diamondTypes: PriceOption[];
  metalColors: PriceOption[];
  description: string;
  originalPrice?: number;
  discountLabel?: string;
}

//////////////////////
// Stripe init
//////////////////////
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

//////////////////////
// Currency helper
//////////////////////
const formatCurrency = (n?: number) =>
  typeof n === 'number'
    ? `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : '-';

//////////////////////
// Component
//////////////////////
const ChainDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { pathname } = useLocation();

  // Determine men vs women
  const gender = pathname.includes('/women') ? 'women' : 'men';
  const apiBase = `/${gender}-chains`;
  const listPath = `/${gender}/chains`;
  const breadcrumbTitle = `${gender === 'men' ? 'Men’s' : 'Women’s'} Chains`;

  const { addItem } = useCart();
  const [chain, setChain] = useState<Chain | null>(null);
  const [related, setRelated] = useState<Chain[]>([]);
  const [loading, setLoading] = useState(true);

  // Variant & UI state
  const [mainImg, setMainImg] = useState<string>('');
  const [activeSize, setActiveSize] = useState<string>('');
  const [activeMetal, setActiveMetal] = useState<string>('');
  const [activeDiamond, setActiveDiamond] = useState<string>('');
  const [activeColor, setActiveColor] = useState<string>('');
  const [qty, setQty] = useState(1);

  // Fetch chain + related
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data: c } = await api.get<Chain>(`${apiBase}/${id}`);
        setChain(c);

        // init selections
        setMainImg(c.images[0] || '');
        setActiveSize(c.sizes[0]?.label || '');
        setActiveMetal(c.metalTypes[0]?.label || '');
        setActiveDiamond(c.diamondTypes[0]?.label || '');
        setActiveColor(c.metalColors[0]?.label || '');

        const { data: rel } = await api.get<Chain[]>(`${apiBase}?limit=4`);
        setRelated(rel.filter(x => x._id !== id));
      } catch (err) {
        console.error('Chain fetch failed', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [apiBase, id]);

  // Compute unit price from variants
  const unitPrice = useMemo(() => {
    if (!chain) return 0;
    let sum = 0;
    chain.sizes.find(o => o.label === activeSize)?.price && (sum += chain.sizes.find(o => o.label === activeSize)!.price);
    chain.metalTypes.find(o => o.label === activeMetal)?.price && (sum += chain.metalTypes.find(o => o.label === activeMetal)!.price);
    chain.diamondTypes.find(o => o.label === activeDiamond)?.price && (sum += chain.diamondTypes.find(o => o.label === activeDiamond)!.price);
    chain.metalColors.find(o => o.label === activeColor)?.price && (sum += chain.metalColors.find(o => o.label === activeColor)!.price);
    return sum;
  }, [chain, activeSize, activeMetal, activeDiamond, activeColor]);

  // Total = unitPrice × qty
  const totalPrice = unitPrice * qty;

  // Add to cart
  const handleAddToCart = () => {
    if (!chain) return;
    addItem({
          id: chain._id,
          name: chain.name,
          image: mainImg,
          price: totalPrice,
          quantity: qty,
          selectedColor: activeColor, // Added selectedColor
          variants: {
            size: activeSize,
            metalType: activeMetal,
            diamondType: activeDiamond,
            color: activeColor
          }
        });
  };

  // Stripe “Buy Now”
  const handleBuyNow = async () => {
    if (!chain) return;
    const lineItems = [{
      price_data: {
        currency: 'usd',
        product_data: { name: chain.name },
        unit_amount: Math.round(unitPrice * 100),
      },
      quantity: qty,
    }];
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/checkout/create-checkout-session',
        {
          items: lineItems,
          successUrl: `${window.location.origin}/success`,
          cancelUrl:  `${window.location.origin}/cancel`,
        }
      );
      window.location.href = data.url;
    } catch (err) {
      console.error('Checkout error', err);
      alert('Failed to initiate checkout.');
    }
  };

  if (loading) return <p className="p-10 text-center">Loading…</p>;
  if (!chain)   return <p className="p-10 text-center">Product not found.</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs mb-6 text-gray-500">
        <Link to="/" className="hover:underline">Home</Link> /{' '}
        <Link to={listPath} className="hover:underline capitalize">
          {breadcrumbTitle}
        </Link> /{' '}
        <span className="text-gray-800">{chain.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <img
            src={mainImg}
            alt={chain.name}
            className="w-full rounded-lg border object-contain aspect-square"
          />
          <div className="flex space-x-2 mt-4">
            {chain.images.map(src => (
              <img
                key={src}
                src={src}
                alt={`Thumbnail of ${chain.name}`}
                onClick={() => setMainImg(src)}
                className={`w-20 h-20 object-cover rounded cursor-pointer border ${
                  src === mainImg ? 'ring-2 ring-gray-800' : ''
                }`}
              />
            ))}
            {chain.videos?.map(vid => (
              <video
                key={vid}
                src={vid}
                controls
                onClick={() => setMainImg(vid)}
                className="w-20 h-20 object-cover rounded border cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          {chain.discountLabel && (
            <span className="inline-block bg-red-600 text-white text-xs px-2 py-0.5 rounded mb-2">
              {chain.discountLabel}
            </span>
          )}
          <h1 className="text-2xl font-bold mb-2">{chain.name}</h1>
          <div className="mb-4">
            <span className="text-xl font-semibold text-rose-600">
              {formatCurrency(totalPrice)}
            </span>
            {chain.originalPrice && (
              <span className="line-through text-gray-400 text-base ml-3">
                {formatCurrency(chain.originalPrice * qty)}
              </span>
            )}
          </div>

          {/* Variant selectors */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">Length</h4>
              <div className="flex flex-wrap gap-2">
                {chain.sizes.map(o => (
                  <button
                    key={o.label}
                    onClick={() => setActiveSize(o.label)}
                    className={`px-3 py-1 text-sm border rounded ${
                      activeSize === o.label ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-1">Metal Type</h4>
              <div className="flex flex-wrap gap-2">
                {chain.metalTypes.map(o => (
                  <button
                    key={o.label}
                    onClick={() => setActiveMetal(o.label)}
                    className={`px-3 py-1 text-sm border rounded ${
                      activeMetal === o.label ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-1">Diamond Type</h4>
              <div className="flex flex-wrap gap-2">
                {chain.diamondTypes.map(o => (
                  <button
                    key={o.label}
                    onClick={() => setActiveDiamond(o.label)}
                    className={`px-3 py-1 text-sm border rounded ${
                      activeDiamond === o.label ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-1">Metal Color</h4>
              <div className="flex flex-wrap gap-2">
                {chain.metalColors.map(o => (
                  <button
                    key={o.label}
                    onClick={() => setActiveColor(o.label)}
                    className={`px-3 py-1 text-sm border rounded ${
                      activeColor === o.label ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="flex items-center space-x-4 mt-6 mb-8">
            <div className="flex items-center border rounded overflow-hidden">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                disabled={qty <= 1}
                className={`px-3 text-lg ${
                  qty <= 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'
                }`}
              >
                −
              </button>
              <span className="px-4">{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="px-3 text-lg hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              Add {qty} to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 py-3 border rounded hover:bg-gray-100"
            >
              Buy Now
            </button>
          </div>

          {/* Description */}
          <details open className="mb-4">
            <summary className="cursor-pointer font-medium py-2">Description</summary>
            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
              {chain.description}
            </p>
          </details>
        </div>
      </div>

      {/* Related Chains */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map(c => (
              <ProductCard
                key={c._id}
                id={c._id}
                category={gender}
                to={`${listPath}/${c._id}`}
                name={c.name}
                image={c.images[0]}
                price={c.sizes[0]?.price || 0}
                original={c.originalPrice}
                badge={c.discountLabel}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ChainDetail;
