import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Product {
  _id: string;
  name: string;
  images: string[];
  price: Record<string, any>;
  originalPrice?: number;
  description: string;
  discount?: number;
  diamondType?: string;
  style?: string;
}

const ChainsList: React.FC = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [priceRange, setPriceRange] = useState({ min: 0, max: 250000 });
  const [diamondType, setDiamondType] = useState<string[]>([]);
  const [style, setStyle] = useState<string[]>([]);

  const productsPerPage = 9;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Product[]>("http://localhost:5000/api/chains");
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Something went wrong while fetching products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter logic
  const filteredProducts = products.filter((product) => {
    const price =
      typeof Object.values(product.price)[0] === "object"
        ? Object.values(Object.values(product.price)[0])[0]
        : Object.values(product.price)[0];

    const matchesPrice = price >= priceRange.min && price <= priceRange.max;
    const matchesDiamondType = diamondType.length
      ? diamondType.includes(product.diamondType || "")
      : true;
    const matchesStyle = style.length
      ? style.includes(product.style || "")
      : true;

    return matchesPrice && matchesDiamondType && matchesStyle;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Checkbox change handler
  const handleCheckboxChange = (
    setState: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    setState((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      {/* ===== Hero / Banner Section ===== */}
      <div className="relative bg-black text-yellow-400 h-[300px] flex items-center justify-center mb-8">
        {/* 
          Optionally, you can use a background image:
          style={{ backgroundImage: "url('/path/to/your/image.jpg')" }}
        */}
        <div className="text-center px-4">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 uppercase tracking-wider">
            Diamond Chains
          </h1>
          <p className="text-sm sm:text-lg text-yellow-300">
            Luxury Diamond Chains for Every Occasion
          </p>
        </div>
      </div>

      {/* ===== Main Content ===== */}
      <div className="px-4 flex flex-col lg:flex-row gap-8">
        {/* ===== Sidebar / Filters ===== */}
        <aside className="w-full lg:w-72 shrink-0">
          <h2 className="font-bold text-xl mb-4 uppercase text-gray-700">
            Filters
          </h2>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2 text-gray-800">Price Range</h3>
            <div className="flex gap-2">
              <input
                type="number"
                className="border p-2 w-1/2"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: Number(e.target.value) })
                }
              />
              <input
                type="number"
                className="border p-2 w-1/2"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, max: Number(e.target.value) })
                }
              />
            </div>
          </div>

          {/* Diamond Type */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2 text-gray-800">Diamond Type</h3>
            {["Moissanite Diamond", "Lab Diamond", "Real Dial Diamond"].map(
              (type) => (
                <label key={type} className="block mb-1 text-sm">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={diamondType.includes(type)}
                    onChange={() => handleCheckboxChange(setDiamondType, type)}
                  />
                  {type}
                </label>
              )
            )}
          </div>

          {/* Style */}
          <div>
            <h3 className="font-semibold mb-2 text-gray-800">Style</h3>
            {["Hip-Hop", "Regular"].map((s) => (
              <label key={s} className="block mb-1 text-sm">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={style.includes(s)}
                  onChange={() => handleCheckboxChange(setStyle, s)}
                />
                {s}
              </label>
            ))}
          </div>
        </aside>

        {/* ===== Product Listing ===== */}
        <div className="flex-1">
          {/* Heading and possible sorting controls */}
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Diamond Chains ({filteredProducts.length} Products)
            </h2>
            {/* Add any sorting dropdown here if needed */}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Loading & Error States */}
            {loading && (
              <p className="text-center py-10 col-span-full">
                Loading products...
              </p>
            )}
            {error && (
              <p className="text-center text-red-600 py-10 col-span-full">
                {error}
              </p>
            )}

            {/* Displayed Products */}
            {!loading &&
              !error &&
              displayedProducts.map((product) => {
                const price =
                  typeof Object.values(product.price)[0] === "object"
                    ? Object.values(Object.values(product.price)[0])[0]
                    : Object.values(product.price)[0];

                return (
                  <div
                    key={product._id}
                    className="relative border rounded-md bg-white p-4 shadow-sm hover:shadow-lg transition cursor-pointer"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    {product.discount && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs">
                        Sale - {product.discount}%
                      </span>
                    )}

                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-72 object-cover mb-4 rounded-md"
                    />

                    <h2 className="text-xs uppercase text-gray-400 mb-1 tracking-wide">
                      AprilShine Diamond
                    </h2>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      {product.name}
                    </h3>

                    <div className="mb-2">
                      <span className="text-yellow-600 font-bold mr-2">
                        ${price.toLocaleString("en-US")}
                      </span>
                      {product.originalPrice && (
                        <span className="text-gray-500 line-through text-sm ml-1">
                          ${product.originalPrice.toLocaleString("en-US")}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-8 gap-4">
            <button
              className={`border px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={`border px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChainsList;
