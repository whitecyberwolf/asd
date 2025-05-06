import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import api from '../../lib/api';
import { ProductCard } from '../ProductCard';
import { useCart } from '../../contexts/CartContext';
import { loadStripe } from '@stripe/stripe-js';

interface PriceOption { label: string; price: number }
interface Product {
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

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const formatCurrency = (n?: number) =>
  typeof n === "number"
    ? `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "-";

const ProductDetail: React.FC<{ category: "men" | "women" }> = ({ category }) => {
  const { id } = useParams<{ id: string }>();
  const apiBase = `/${category}-watches`;
  const listPath = `/${category}`;
  const breadcrumbTitle = `${category === "men" ? "Men’s" : "Women’s"} Watches`;

  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // variant state
  const [mainImg, setMainImg] = useState("");
  const [activeSize, setActiveSize] = useState("");
  const [activeMetal, setActiveMetal] = useState("");
  const [activeDiamond, setActiveDiamond] = useState("");
  const [activeColor, setActiveColor] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data: p } = await api.get<Product>(`${apiBase}/${id}`);
        setProduct(p);

        // init selectors
        setMainImg(p.images[0] || "");
        setActiveSize(p.sizes[0]?.label || "");
        setActiveMetal(p.metalTypes[0]?.label || "");
        setActiveDiamond(p.diamondTypes[0]?.label || "");
        setActiveColor(p.metalColors[0]?.label || "");

        const { data: rel } = await api.get<Product[]>(`${apiBase}?limit=4`);
        setRelated(rel.filter((x) => x._id !== id));
      } catch (err) {
        console.error("Detail fetch failed", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [apiBase, id]);

  const unitPrice = useMemo(() => {
    if (!product) return 0;
    let sum = 0;
    product.sizes.find((o) => o.label === activeSize)?.price && (sum += product.sizes.find((o) => o.label === activeSize)!.price);
    product.metalTypes.find((o) => o.label === activeMetal)?.price && (sum += product.metalTypes.find((o) => o.label === activeMetal)!.price);
    product.diamondTypes.find((o) => o.label === activeDiamond)?.price && (sum += product.diamondTypes.find((o) => o.label === activeDiamond)!.price);
    product.metalColors.find((o) => o.label === activeColor)?.price && (sum += product.metalColors.find((o) => o.label === activeColor)!.price);
    return sum;
  }, [product, activeSize, activeMetal, activeDiamond, activeColor]);

  const totalPrice = unitPrice * qty;

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product._id,
      name: product.name,
      image: mainImg,
      price: totalPrice,
      quantity: qty,
      selectedColor: activeColor, // Added selectedColor property
      variants: {
        size: activeSize,
        metalType: activeMetal,
        diamondType: activeDiamond,
        color: activeColor,
      },
    });
  };

  const handleBuyNow = async () => {
    if (!product) return;
    try {
      const { data } = await axios.post("http://localhost:5000/api/checkout/create-checkout-session", {
        items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: product.name },
              unit_amount: Math.round(unitPrice * 100),
            },
            quantity: qty,
          },
        ],
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cancel`,
      });
      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error", err);
      alert("Failed to initiate checkout.");
    }
  };

  if (loading) return <p className="p-10 text-center">Loading…</p>;
  if (!product) return <p className="p-10 text-center">Product not found.</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <nav className="text-xs mb-6 text-gray-500">
        <Link to="/" className="hover:underline">Home</Link> /{" "}
        <Link to={listPath} className="hover:underline capitalize">
          {breadcrumbTitle}
        </Link>{" "}
        / <span className="text-gray-800">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <img src={mainImg} alt={product.name} className="w-full rounded-lg border object-contain aspect-square" />
          <div className="flex space-x-2 mt-4">
            {product.images.map((src) => (
              <img
                key={src}
                src={src}
                alt="thumbnail"
                onClick={() => setMainImg(src)}
                className={`w-20 h-20 object-cover rounded cursor-pointer border ${
                  src === mainImg ? "ring-2 ring-gray-800" : ""
                }`}
              />
            ))}
            {product.videos?.map((vid) => (
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
          {product.discountLabel && (
            <span className="inline-block bg-red-600 text-white text-xs px-2 py-0.5 rounded mb-2">
              {product.discountLabel}
            </span>
          )}
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div className="mb-4">
            <span className="text-xl font-semibold text-rose-600">{formatCurrency(totalPrice)}</span>
            {product.originalPrice && (
              <span className="line-through text-gray-400 text-base ml-3">
                {formatCurrency(product.originalPrice * qty)}
              </span>
            )}
          </div>

          {/* variants */}
          <div className="space-y-4">
            {["Length", "Metal Type", "Diamond Type", "Metal Color"].map((label, idx) => {
              const opts = [product.sizes, product.metalTypes, product.diamondTypes, product.metalColors][idx];
              const active = [activeSize, activeMetal, activeDiamond, activeColor][idx];
              const setter = [setActiveSize, setActiveMetal, setActiveDiamond, setActiveColor][idx];
              return (
                <div key={label}>
                  <h4 className="font-medium mb-1">{label}</h4>
                  <div className="flex flex-wrap gap-2">
                    {opts.map((o) => (
                      <button
                        key={o.label}
                        onClick={() => setter(o.label)}
                        className={`px-3 py-1 text-sm border rounded ${active === o.label ? "bg-gray-900 text-white" : "hover:bg-gray-100"}`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* qty & actions */}
          <div className="flex items-center space-x-4 mt-6 mb-8">
            <div className="flex items-center border rounded overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                className={`px-3 text-lg ${qty <= 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"}`}
              >
                −
              </button>
              <span className="px-4">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-3 text-lg hover:bg-gray-100">
                +
              </button>
            </div>
            <button onClick={handleAddToCart} className="flex-1 py-3 bg-yellow-600 text-white rounded hover:bg-yellow-700">
              Add {qty} to Cart
            </button>
            <button onClick={handleBuyNow} className="flex-1 py-3 border rounded hover:bg-gray-100">
              Buy Now
            </button>
          </div>

          <details open className="mb-4">
            <summary className="cursor-pointer font-medium py-2">Description</summary>
            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">{product.description}</p>
          </details>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard
                key={p._id}
                to={`/${category}/${p._id}`}  // watch detail
                name={p.name}
                image={p.images[0]}
                price={p.sizes[0]?.price || 0}
                original={p.originalPrice}
                badge={p.discountLabel}
                category={category}
                id={p._id}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
