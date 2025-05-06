import React, { useEffect, useState } from 'react';
import { useParams, useNavigate }        from 'react-router-dom';
import api                                from '../../lib/api';
import { Hero }                           from '../men/MHero';
import { ProductCard }                    from '../ProductCard';
import { useCart }                        from '../../contexts/CartContext';
import { AiOutlineHeart } from 'react-icons/ai';
import { IoShareOutline }  from 'react-icons/io5';

interface WatchDetail {
  _id: string;
  name: string;
  images: string[];
  sizes: { label: string; price: number }[];
  metalColors: { label: string; price: number }[];
  discountedPrice?: number;
  originalPrice?: number;
  discountLabel?: string;
  description?: string;
  productDetails?: string[];
  shippingInfo?: string[];
  isNew?: boolean;
}

const MenWatchDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [watch, setWatch]               = useState<WatchDetail| null>(null);
  const [mainImage, setMainImage]       = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity]         = useState<number>(1);
  const [showDesc, setShowDesc]         = useState(false);
  const [showDetails, setShowDetails]   = useState(false);
  const [showShip, setShowShip]         = useState(false);
  const [related, setRelated]           = useState<WatchDetail[]>([]);

  // 1) fetch the one watch
  useEffect(() => {
    if (!id) return;
    api.get(`/men-watches/${id}`)
      .then(res => {
        setWatch(res.data);
        setMainImage(res.data.images[0]);
        setSelectedSize(res.data.sizes[0]?.label || '');
        setSelectedColor(res.data.metalColors[0]?.label || '');
      })
      .catch(console.error);
  }, [id]);

  // 2) fetch 4 related
  useEffect(() => {
    api.get('/men-watches').then(res => {
      const list = (res.data as WatchDetail[])
        .filter(w => w._id !== id)
        .slice(0, 4);
      setRelated(list);
    });
  }, [id]);

  if (!watch) return <div className="p-8">Loading…</div>;

  const salePrice = watch.discountedPrice ?? watch.sizes[0].price;
  const original  = watch.originalPrice;

  const handleAddToCart = () => {
    addItem({
      id: watch._id,
      productId: watch._id,
      name: watch.name,
      image: mainImage,
      price: salePrice,
      quantity,
      selectedSize,
      selectedColor,
    });
  };
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <div className="bg-white">
      <Hero
        title="Men’s Watches"
        subtitle=""
        breadcrumb={['Home', 'Men’s Watches', watch.name]}
        bgImage="/images/men-hero.jpg"
      />

      <div className="container mx-auto py-8 flex gap-8">
        {/* thumbnails */}
        <div className="space-y-4 flex-shrink-0">
          {watch.images.map((img,i) => (
            <img
              key={i}
              src={img}
              alt={`${watch.name} thumb ${i}`}
              className="h-20 w-20 object-cover rounded border cursor-pointer"
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>

        {/* main image + info */}
        <div className="flex-1 grid grid-cols-[1fr,2fr] gap-6">
          {/* left: image */}
          <div className="relative">
            {watch.discountLabel && (
              <div className="absolute top-3 left-3 bg-orange-600 text-white px-2 py-1 text-xs rounded">
                {watch.discountLabel}
              </div>
            )}
            <img
              src={mainImage}
              alt={watch.name}
              className="w-full h-auto object-contain rounded"
            />
            <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow">
              {/* magnifier icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M11 4a7 7 0 00-7 7 7 7 0 107 7 7 7 0 00-7-7m7 7l5 5"/>
              </svg>
            </div>
          </div>

          {/* right: details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {watch.isNew && (
                <span className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded">New Arrival</span>
              )}
              <h1 className="text-2xl font-semibold">{watch.name}</h1>
              <div className="ml-auto flex space-x-2 text-gray-600">
                <AiOutlineHeart className="w-5 h-5 cursor-pointer"/>
                <IoShareOutline  className="w-5 h-5 cursor-pointer"/>
              </div>
            </div>

            <div className="flex items-baseline space-x-4">
              <span className="text-2xl font-bold">
                {new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR'}).format(salePrice)}
              </span>
              {original && (
                <span className="text-gray-500 line-through">
                  {new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR'}).format(original)}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">Incl. of all taxes</p>

            {/* Length pick */}
            <div>
              <h3 className="font-medium mb-2">Length</h3>
              <div className="flex space-x-2">
                {watch.sizes.map(s => (
                  <button
                    key={s.label}
                    onClick={() => setSelectedSize(s.label)}
                    className={`px-4 py-2 border rounded text-sm ${
                      selectedSize === s.label ? 'bg-gray-900 text-white' : ''
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color pick */}
            <div>
              <h3 className="font-medium mb-2">Color</h3>
              <div className="flex space-x-2">
                {watch.metalColors.map(c => (
                  <button
                    key={c.label}
                    onClick={() => setSelectedColor(c.label)}
                    className={`px-4 py-2 border rounded text-sm ${
                      selectedColor === c.label ? 'bg-gray-900 text-white' : ''
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty */}
            <div>
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex items-center space-x-2">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1 border">−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-1 border">+</button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4">
              <button onClick={handleAddToCart} className="flex-1 px-4 py-2 border rounded text-sm">
                Add to Cart
              </button>
              <button onClick={handleBuyNow} className="flex-1 px-4 py-2 bg-black text-white rounded text-sm">
                Buy Now
              </button>
            </div>

            {/* Trust blurbs */}
            <ul className="space-y-2 text-sm text-gray-600">
              <li>🔒 Flexible and secure payment, pay on delivery</li>
              <li>😊 600,000 happy customers</li>
            </ul>

            {/* Accordions */}
            <div className="border-t pt-4 space-y-4 text-sm">
              {/* Description */}
              <div>
                <button
                  className="w-full flex justify-between"
                  onClick={() => setShowDesc(d => !d)}
                >
                  <span>Description</span><span>{showDesc ? '−' : '+'}</span>
                </button>
                {showDesc && <p className="mt-2 text-gray-700">{watch.description}</p>}
              </div>
              {/* Product Details */}
              <div>
                <button className="w-full flex justify-between" onClick={() => setShowDetails(d => !d)}>
                  <span>Product Details</span><span>{showDetails ? '−' : '+'}</span>
                </button>
                {showDetails && (
                  <ul className="mt-2 list-disc list-inside text-gray-700">
                    {watch.productDetails?.map((line,i) => <li key={i}>{line}</li>)}
                  </ul>
                )}
              </div>
              {/* Shipping */}
              <div>
                <button className="w-full flex justify-between" onClick={() => setShowShip(s => !s)}>
                  <span>Shipping Info</span><span>{showShip ? '−' : '+'}</span>
                </button>
                {showShip && (
                  <ul className="mt-2 list-disc list-inside text-gray-700">
                    {watch.shippingInfo?.map((line,i) => <li key={i}>{line}</li>)}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED */}
      <div className="container mx-auto py-8">
        <h2 className="text-xl font-semibold mb-4">You May Also Like</h2>
        <div className="grid grid-cols-4 gap-6">
          {related.map(r => (
            <ProductCard
              key={r._id}
              category="men"
              id={r._id}
              name={r.name}
              image={r.images[0]}
              price={r.discountedPrice ?? r.sizes[0].price}
              original={r.originalPrice}
              badge={r.discountLabel}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenWatchDetail;
