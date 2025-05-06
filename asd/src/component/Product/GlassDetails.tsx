// src/components/GlassDetail.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface Glass {
  _id: string;
  title: string;
  price: number;
  originalPrice?: number;
  salePercentage?: number;
  metalColors: string[];
  description: string;
  details: {
    diamond: string;
    material: string;
    diamondTesterPass: boolean;
    note: string;
  };
  images: string[];
  video?: string;
}

const GlassDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [glass, setGlass] = useState<Glass | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  useEffect(() => {
    const fetchGlass = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/eyeglasses/${id}`);
        setGlass(response.data);
      } catch (err) {
        console.error("Error fetching glass:", err);
        setError("Something went wrong while fetching the product.");
      } finally {
        setLoading(false);
      }
    };

    fetchGlass();
  }, [id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin h-8 w-8 border-4 border-orange-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10 p-4 border border-red-200 rounded-md bg-red-50">{error}</div>;
  }

  if (!glass) {
    return <div className="text-center mt-10">Product not found</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Gallery */}
        <div className="w-full md:w-1/2">
          <div className="sticky top-4">
            {/* Main Image */}
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img
                src={glass.images[currentImageIndex] || "https://via.placeholder.com/600"}
                alt={glass.title}
                className="w-full h-96 object-contain"
              />
            </div>

            {/* Thumbnail Gallery */}
            {glass.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {glass.images.map((image, index) => (
                  <button
                    key={index}
                    className={`border rounded-md overflow-hidden ${currentImageIndex === index ? "ring-2 ring-orange-500" : ""}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`${glass.title} thumbnail ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2">
          <h1 className="text-2xl font-bold mb-2">{glass.title}</h1>

          {/* Price */}
          <div className="mb-4">
            {glass.originalPrice && glass.originalPrice > glass.price ? (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-orange-600">
                  {formatCurrency(glass.price)}
                </span>
                <span className="text-gray-500 line-through">
                  {formatCurrency(glass.originalPrice)}
                </span>
                {glass.salePercentage && (
                  <span className="ml-2 bg-red-500 text-white text-sm px-2 py-1 rounded">
                    {glass.salePercentage}% OFF
                  </span>
                )}
              </div>
            ) : (
              <span className="text-2xl font-bold text-gray-800">
                {formatCurrency(glass.price)}
              </span>
            )}
          </div>

          {/* Metal Colors */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Available Colors:</h3>
            <div className="flex flex-wrap gap-2">
              {glass.metalColors.map((color) => (
                <span
                  key={color}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{glass.description}</p>
          </div>

          {/* Details */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Product Details</h3>
            <ul className="space-y-2">
              <li>
                <span className="font-medium">Material:</span> {glass.details.material}
              </li>
              <li>
                <span className="font-medium">Diamond:</span> {glass.details.diamond}
              </li>
              <li>
                <span className="font-medium">Diamond Tester:</span>{" "}
                {glass.details.diamondTesterPass ? "Pass" : "Fail"}
              </li>
              {glass.details.note && (
                <li>
                  <span className="font-medium">Note:</span> {glass.details.note}
                </li>
              )}
            </ul>
          </div>

          {/* Video */}
          {glass.video && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Product Video</h3>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={glass.video}
                  className="w-full h-64"
                  title={`${glass.title} video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition">
              Add to Cart
            </button>
            <button className="border border-orange-500 text-orange-500 px-6 py-3 rounded-md hover:bg-orange-50 transition">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlassDetail;