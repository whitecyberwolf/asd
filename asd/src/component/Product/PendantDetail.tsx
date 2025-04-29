import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

interface Pendant {
  _id: string;
  name: string;
  description: string;
  images: string[];
  video: string;
  // Example price structure. Adjust as needed for your data:
  price: Record<string, number> | Record<string, Record<string, number>> | number;
  metalColour: string[];
  details: {
    diamond?: string;
    clarity?: string;
    cut?: string;
    width?: string;
    length?: string[];
    weight?: string;
    material?: string;
    [key: string]: any;
  };
}

const PendantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [pendant, setPendant] = useState<Pendant | null>(null);
  const [error, setError] = useState<string>("");

  // Recommended pendants
  const [recommendedPendants, setRecommendedPendants] = useState<Pendant[]>([]);

  // Pendant detail states
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedVariantKey, setSelectedVariantKey] = useState<string>(""); 
  // e.g. if price is an object with keys
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    // Fetch main pendant
    const fetchPendant = async () => {
      try {
        // Single pendant by ID
        const res = await axios.get<Pendant>(
          `http://localhost:5000/api/pendants/${id}`
        );
        const data = res.data;
        setPendant(data);

        // Default selections:
        // 1) Set the first image
        setSelectedImage(data.images?.[0]);

        // 2) If `price` is an object with multiple keys,
        //    default to the first key. Adjust logic as needed
        if (typeof data.price === "object" && !Array.isArray(data.price)) {
          const priceKeys = Object.keys(data.price);
          if (priceKeys.length > 0) {
            setSelectedVariantKey(priceKeys[0]);
          }
        }

        // 3) If there's metalColour array
        if (data.metalColour?.length > 0) {
          setSelectedColor(data.metalColour[0]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch pendant details");
      }
    };

    // Fetch recommended pendants
    const fetchRecommendedPendants = async () => {
      try {
        const res = await axios.get<Pendant[]>(
          "http://localhost:5000/api/pendants/recommended"
        );
        setRecommendedPendants(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPendant();
    fetchRecommendedPendants();
  }, [id]);

  // Calculate displayed price
  // If your price structure is simple (just a number), you can skip the object logic
  const calculatePrice = () => {
    if (!pendant) return 0;

    // If `pendant.price` is a simple number
    if (typeof pendant.price === "number") {
      return pendant.price * quantity;
    }

    // If `pendant.price` is an object with variant keys
    if (typeof pendant.price === "object" && selectedVariantKey) {
      const variantPrice = (pendant.price as Record<string, any>)[selectedVariantKey];
      // If that price is a number
      if (typeof variantPrice === "number") {
        return variantPrice * quantity;
      }

      // or if variantPrice is another object with multiple nested keys,
      // you can add further logic here if needed.
    }

    return 0; // fallback
  };

  // Handler for "Buy Now" using Stripe Checkout
  const handleBuyNow = async () => {
    if (!pendant) return;

    try {
      // Convert price to cents (assuming calculatePrice returns USD)
      const amountInCents = Math.round(calculatePrice() * 100);

      // Send request to create Stripe Checkout session
      const response = await axios.post("http://localhost:5000/create-checkout-session", {
        productId: pendant._id,
        productName: pendant.name,
        amount: amountInCents,
        quantity,
      });

      // Redirect to the Stripe Checkout page
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Error in checkout:", error);
    }
  };

  if (error) {
    return <p className="text-red-500 text-center py-10">{error}</p>;
  }

  if (!pendant) {
    return <p className="text-center py-10">Loading...</p>;
  }

  const displayPrice = `$${calculatePrice().toLocaleString("en-US")}`;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {/* ========== Main Grid: Images & Details ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN: Images & Video */}
        <div className="relative">
          <img
            src={selectedImage}
            alt={pendant.name}
            className="w-full h-[500px] object-cover rounded-lg shadow-md mb-4"
          />

          <div className="flex gap-2 overflow-x-auto">
            {pendant.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx}`}
                className={`w-20 h-20 rounded cursor-pointer border-2 ${
                  selectedImage === img ? "border-gray-800" : "border-gray-200"
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>

          {pendant.video && (
            <video controls className="mt-4 w-full rounded-lg shadow-md">
              <source src={pendant.video} type="video/mp4" />
              Your browser doesn't support video.
            </video>
          )}
        </div>

        {/* RIGHT COLUMN: Product Details */}
        <div>
          <h1 className="text-3xl font-semibold mb-2">{pendant.name}</h1>

          <div className="flex items-baseline gap-2 mb-4">
            <p className="text-2xl font-bold text-gray-900">{displayPrice}</p>
            <span className="text-sm text-gray-500">(incl. of all taxes)</span>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Flexible and secure payment
          </p>

          {/* Example "variant" Options (if your price is an object with keys) */}
          {typeof pendant.price === "object" && !Array.isArray(pendant.price) && (
            <div className="mb-4">
              <h3 className="font-medium mb-1">Variant</h3>
              <div className="flex gap-2">
                {Object.keys(pendant.price).map((variantKey) => (
                  <button
                    key={variantKey}
                    onClick={() => setSelectedVariantKey(variantKey)}
                    className={`px-3 py-1 rounded border ${
                      selectedVariantKey === variantKey
                        ? "bg-gray-800 text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {variantKey}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Metal Color */}
          {pendant.metalColour && pendant.metalColour.length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium mb-1">Color</h3>
              <div className="flex gap-2">
                {pendant.metalColour.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1 rounded border ${
                      selectedColor === color
                        ? "bg-gray-800 text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-4">
            <h3 className="font-medium mb-1">Quantity</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}
                className="px-4 py-1 bg-gray-200 rounded"
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => setQuantity((qty) => qty + 1)}
                className="px-4 py-1 bg-gray-200 rounded"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart & Buy Now */}
          <div className="flex gap-4 mb-6">
            <button className="flex-1 py-3 bg-gray-900 text-white rounded">
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 py-3 bg-orange-500 text-white rounded"
            >
              Buy Now
            </button>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-gray-600 leading-relaxed">{pendant.description}</p>
          </div>

          {/* Product Highlights / Details */}
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Product Highlights</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {pendant.details?.diamond && (
                <li>Diamond: {pendant.details.diamond}</li>
              )}
              {pendant.details?.clarity && (
                <li>Clarity: {pendant.details.clarity}</li>
              )}
              {pendant.details?.cut && <li>Cut: {pendant.details.cut}</li>}
              {pendant.details?.width && <li>Width: {pendant.details.width}</li>}
              {pendant.details?.weight && <li>Weight: {pendant.details.weight}</li>}
              {pendant.details?.material && (
                <li>Material: {pendant.details.material}</li>
              )}
            </ul>
          </div>

          {/* Guarantee Safe Checkout */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Guarantee Safe Checkout</h3>
            <div className="flex items-center gap-4">
              <img
                src="https://via.placeholder.com/50x30?text=PayPal"
                alt="PayPal"
              />
              <img
                src="https://via.placeholder.com/50x30?text=Stripe"
                alt="Stripe"
              />
              <img
                src="https://via.placeholder.com/50x30?text=Visa"
                alt="Visa"
              />
              <img
                src="https://via.placeholder.com/50x30?text=Mastercard"
                alt="Mastercard"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========== YOU MAY ALSO LIKE SECTION ========== */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">You may also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {recommendedPendants.map((item) => {
            // Example fallback logic for price if it's an object with keys
            let itemPrice = 0;
            if (typeof item.price === "number") {
              itemPrice = item.price;
            } else if (typeof item.price === "object") {
              const firstKey = Object.keys(item.price)[0];
              const val = (item.price as Record<string, any>)[firstKey];
              if (typeof val === "number") itemPrice = val;
              // or if val is itself an object, you'd parse further
            }

            return (
              <div
                key={item._id}
                className="border p-4 text-center rounded hover:shadow-md cursor-pointer"
                onClick={() => navigate(`/product/${item._id}`)}
              >
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="mx-auto mb-2 w-full h-48 object-cover rounded"
                />
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-gray-600">
                  ${itemPrice.toLocaleString("en-US")}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PendantDetail;
