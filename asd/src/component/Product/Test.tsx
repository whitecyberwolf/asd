import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "Chains", id!); // Updated collection to "Chains"
        const productDoc = await getDoc(docRef);
        if (productDoc.exists()) {
          setProduct(productDoc.data());
          setSelectedColor(productDoc.data().metal_colors?.[0] || ""); // Default to the first color
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <p className="text-center text-lg py-10">Loading product details...</p>;
  }

  if (!product) {
    return <p className="text-center text-lg py-10">Product not found.</p>;
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          {product.image_urls && product.image_urls.length > 0 ? (
            <>
              <img
                src={product.image_urls[0]}
                alt={product.title}
                className="w-full h-96 object-cover rounded-lg shadow-md mb-4"
              />
              <div className="flex space-x-4 overflow-x-auto">
                {product.image_urls.map((url: string, index: number) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Thumbnail ${index}`}
                    className="w-20 h-20 object-cover rounded border cursor-pointer hover:opacity-80"
                  />
                ))}
              </div>
            </>
          ) : (
            <img
              src="https://via.placeholder.com/400"
              alt="Placeholder"
              className="w-full h-96 object-cover rounded-lg shadow-md mb-4"
            />
          )}
        </div>

        {/* Product Details */}
        <div>
          {/* Title */}
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

          {/* Price */}
          {product.sale_price ? (
            <div className="mb-4">
              <p className="text-red-500 text-2xl font-bold">
                Rs. {product.sale_price.toLocaleString("en-IN")}
              </p>
              <p className="text-gray-500 line-through">
                Rs. {product.regular_price.toLocaleString("en-IN")}
              </p>
            </div>
          ) : (
            <p className="text-gray-800 text-2xl font-bold mb-4">
              Rs. {product.regular_price.toLocaleString("en-IN")}
            </p>
          )}

          {/* Metal Colors */}
          {product.metal_colors && product.metal_colors.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Color</h3>
              <div className="flex space-x-2">
                {product.metal_colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded ${
                      selectedColor === color
                        ? "bg-[#9c7a56] text-white"
                        : "bg-white"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Quantity</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <p className="text-lg">{quantity}</p>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex space-x-4">
            <button className="w-full bg-[#9c7a56] text-white py-3 rounded-md hover:bg-[#7c5f47]">
              Add to Cart
            </button>
            <button className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800">
              Buy Now
            </button>
          </div>

          {/* Product Details */}
          <div className="mt-6">
            {product.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>
            )}
            {product.details && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Product Details</h3>
                <ul className="text-gray-700 space-y-2">
                  {product.details.diamond && (
                    <li>
                      <strong>Diamond:</strong> {product.details.diamond}
                    </li>
                  )}
                  {product.details.material && (
                    <li>
                      <strong>Material:</strong> {product.details.material}
                    </li>
                  )}
                  {product.details.material_finish && (
                    <li>
                      <strong>Material Finish:</strong>{" "}
                      {product.details.material_finish}
                    </li>
                  )}
                  {product.details.diamond_tester_pass !== undefined && (
                    <li>
                      <strong>Diamond Tester Pass:</strong>{" "}
                      {product.details.diamond_tester_pass ? "Yes" : "No"}
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
