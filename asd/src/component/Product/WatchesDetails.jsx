// src/component/Product/WatchDetail.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

/**
 * formatDollars
 * Formats a number as US Dollars.
 */
function formatDollars(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

const WatchDetail = ({ onAddToCart }) => {
  const { id } = useParams(); // expects route: /watch/:id
  const navigate = useNavigate();
  const FALLBACK_IMAGE = "https://dummyimage.com/600x400/ddd/000.png&text=No+Image";

  // State Variables
  const [watch, setWatch] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState("");
  const [similarWatches, setSimilarWatches] = useState([]);

  // 1) Fetch watch details from MongoDB (via Express)
  useEffect(() => {
    const fetchWatch = async () => {
      if (!id) return;
      try {
        const response = await axios.get(`http://localhost:5000/api/watches/${id}`);
        const data = response.data;
        setWatch(data);
        setSelectedImage(
          data.imageUrls && data.imageUrls.length > 0 ? data.imageUrls[0] : FALLBACK_IMAGE
        );
      } catch (err) {
        console.error("Error fetching watch:", err);
        setError("Failed to fetch watch details.");
      }
    };
    fetchWatch();
  }, [id]);

  // 2) Calculate total price based on quantity and selected price
  useEffect(() => {
    if (watch) {
      const price =
        (watch.price && (watch.price.salePrice || watch.price.regularPrice)) || 0;
      setTotalPrice(price * quantity);
    }
  }, [watch, quantity]);

  // 3) Fetch similar watches (exclude the current one)
  useEffect(() => {
    const fetchSimilarWatches = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/watches");
        const products = response.data.filter((item) => item._id !== id);
        setSimilarWatches(products.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch similar watches:", err);
      }
    };
    if (watch) {
      fetchSimilarWatches();
    }
  }, [watch, id]);

  // Handler for changing quantity
  const handleQuantityChange = (increment) => {
    setQuantity((prev) => (increment ? prev + 1 : Math.max(1, prev - 1)));
  };

  // Add to Cart handler
  const addToCart = () => {
    if (!watch) return;
    if (!onAddToCart) {
      alert("onAddToCart callback not provided!");
      return;
    }
    const cartItem = {
      id: watch._id,
      name: watch.name,
      image: selectedImage,
      price: totalPrice,
      oldPrice: watch.originalPrice || totalPrice,
      qty: quantity,
    };
    onAddToCart(cartItem);
  };

  // Buy Now handler (stub)
  const buyNow = () => {
    alert("Buy Now functionality not implemented yet!");
  };

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }
  if (!watch) {
    return <div className="text-center py-10">Loading watch details...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column: Image Gallery */}
        <div className="md:w-1/2">
          <div className="border rounded-lg overflow-hidden">
            <img
              src={selectedImage}
              alt={watch.name}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="flex mt-4 space-x-2 overflow-x-auto">
            {watch.imageUrls && watch.imageUrls.length > 0 ? (
              watch.imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Thumbnail ${index}`}
                  className={`w-20 h-20 object-cover border cursor-pointer rounded ${
                    selectedImage === url ? "border-blue-600" : "border-gray-300"
                  }`}
                  onClick={() => setSelectedImage(url)}
                />
              ))
            ) : (
              <p>No images available</p>
            )}
          </div>
        </div>

        {/* Right Column: Watch Details */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold">{watch.name}</h1>
          <div className="mt-2">
            {watch.originalPrice && (
              <p className="text-gray-500 line-through">
                {formatDollars(watch.originalPrice)}
              </p>
            )}
            <p className="text-2xl font-semibold text-red-600">
              {formatDollars(watch.price.salePrice || watch.price.regularPrice)}
            </p>
            <p className="mt-2">
              Total for {quantity} item{quantity > 1 && "s"}:{" "}
              <span className="font-bold">{formatDollars(totalPrice)}</span>
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="mt-6 flex items-center space-x-4">
            <button
              onClick={() => handleQuantityChange(false)}
              className="px-3 py-1 border rounded-md"
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => handleQuantityChange(true)}
              className="px-3 py-1 border rounded-md"
            >
              +
            </button>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={addToCart}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-md text-lg"
            >
              Add to Cart
            </button>
            <button
              onClick={buyNow}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-md text-lg"
            >
              Buy Now
            </button>
          </div>

          {/* Product Description */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Product Description</h2>
            <p className="text-gray-700">
              {watch.description || "No description available."}
            </p>
          </div>
        </div>
      </div>

      {/* Similar Watches Section */}
      {similarWatches.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similarWatches.map((item) => (
              <div key={item._id} className="group relative">
                <div className="relative aspect-square mb-3">
                  <img
                    src={
                      item.imageUrls && item.imageUrls.length > 0
                        ? item.imageUrls[0]
                        : FALLBACK_IMAGE
                    }
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <h3 className="font-medium">{item.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-medium">
                    {formatDollars(item.price.salePrice || item.price.regularPrice)}
                  </span>
                  {item.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatDollars(item.originalPrice)}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => navigate(`/watch/${item._id}`)}
                  className="mt-2 text-sm text-blue-600 underline"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchDetail;
