import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

const GlassesList: React.FC = () => {
  const navigate = useNavigate();
  const FALLBACK_IMAGE = "https://via.placeholder.com/300";

  // State Variables
  const [allProducts, setAllProducts] = useState<Glass[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Glass[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Sorting
  const [priceRange, setPriceRange] = useState<[number, number]>([300, 10000]);
  const [sortOption, setSortOption] = useState("bestSelling");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMetalColor, setSelectedMetalColor] = useState("");

  // Available filter options
  const [availableMetalColors, setAvailableMetalColors] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 9;

  // Fetch Data from Express/MongoDB
  useEffect(() => {
    const fetchGlasses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/eyeglasses");
        const glassesData = response.data;
        setAllProducts(glassesData);
        setFilteredProducts(glassesData);

        // Extract available metal colors
        const metalColors = new Set<string>();
        glassesData.forEach((glass: Glass) => {
          glass.metalColors.forEach(color => metalColors.add(color));
        });
        setAvailableMetalColors(Array.from(metalColors));
      } catch (err) {
        console.error("Error fetching glasses:", err);
        setError("Something went wrong while fetching glasses.");
      } finally {
        setLoading(false);
      }
    };

    fetchGlasses();
  }, []);

  // Apply Filters, Search, and Sorting
  useEffect(() => {
    if (allProducts.length === 0) return;
    let updated = [...allProducts];

    // Filter by Price Range
    updated = updated.filter((item) => {
      const price = item.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Filter by Search Query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.trim().toLowerCase();
      updated = updated.filter((item) => {
        return (
          (item.title && item.title.toLowerCase().includes(query)) ||
          (item.description && item.description.toLowerCase().includes(query))
        );
      });
    }

    // Filter by Metal Color
    if (selectedMetalColor) {
      updated = updated.filter((item) =>
        item.metalColors.includes(selectedMetalColor)
      );
    }

    // Sorting
    if (sortOption === "lowToHigh") {
      updated.sort((a, b) => a.price - b.price);
    } else if (sortOption === "highToLow") {
      updated.sort((a, b) => b.price - a.price);
    } else if (sortOption === "discount") {
      updated.sort((a, b) => {
        const aDiscount = a.salePercentage || 0;
        const bDiscount = b.salePercentage || 0;
        return bDiscount - aDiscount;
      });
    }

    setFilteredProducts(updated);
    setCurrentPage(1);
  }, [allProducts, priceRange, sortOption, searchQuery, selectedMetalColor]);

  // Pagination Calculation
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirst, indexOfLast);

  // Clear All Filters
  const clearAllFilters = () => {
    setPriceRange([300, 10000]);
    setSortOption("bestSelling");
    setSearchQuery("");
    setSelectedMetalColor("");
  };

  // Format currency
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

  return (
    <div className="max-w-screen-2xl mx-auto">
      {/* Banner Section */}
      <div
        className="w-full h-64 bg-cover bg-center flex items-center justify-center relative"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1556306535-0f09a537f0a3)`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative text-center text-white">
          <h2 className="text-3xl font-bold mb-2">Luxury Moissanite Glasses</h2>
          <p className="text-sm">Discover our exclusive collection of handcrafted 925 silver glasses with VVS Moissanite</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 px-4">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-2">EYEGLASSES</h1>
        <p className="text-gray-600 text-sm mb-6">{filteredProducts.length} Products</p>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar: Filters */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Filters</h2>
              <button onClick={clearAllFilters} className="text-sm text-red-500 hover:underline">
                Clear All
              </button>
            </div>

            <div className="bg-white p-4 border rounded space-y-6">
              {/* Search Filter */}
              <div>
                <h3 className="font-semibold mb-2 text-sm">Search</h3>
                <input
                  type="text"
                  className="border p-1 w-full text-sm"
                  placeholder="Search by name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="font-semibold mb-2 text-sm">Price (₹)</h3>
                <label className="block text-xs text-gray-700" htmlFor="minPrice">
                  Min Price
                </label>
                <input
                  id="minPrice"
                  type="number"
                  className="border p-1 w-full text-sm mb-2"
                  value={priceRange[0]}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setPriceRange([val, priceRange[1]]);
                  }}
                />
                <label className="block text-xs text-gray-700" htmlFor="maxPrice">
                  Max Price
                </label>
                <input
                  id="maxPrice"
                  type="number"
                  className="border p-1 w-full text-sm"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setPriceRange([priceRange[0], val]);
                  }}
                />
              </div>

              {/* Metal Color Filter */}
              {availableMetalColors.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm">Metal Color</h3>
                  <select
                    className="border p-1 w-full text-sm"
                    value={selectedMetalColor}
                    onChange={(e) => setSelectedMetalColor(e.target.value)}
                  >
                    <option value="">All Colors</option>
                    {availableMetalColors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </aside>

          {/* Right Column: Sorting & Product Grid */}
          <div className="flex-1">
            {/* Sort Dropdown */}
            <div className="flex items-center justify-end mb-4">
              <label htmlFor="sortBy" className="mr-2 text-sm font-semibold">
                Sort By:
              </label>
              <select
                id="sortBy"
                className="border px-2 py-1 text-sm"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="bestSelling">Best selling</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.length > 0 ? (
                currentItems.map((product) => {
                  const mainImage = product.images?.[0] || FALLBACK_IMAGE;

                  return (
                    <div
                      key={product._id}
                      className="border rounded-md bg-white shadow-sm hover:shadow-md transition p-3 relative cursor-pointer"
                      onClick={() => navigate(`/eyeglasses/${product._id}`)}
                    >
                      {product.salePercentage && product.salePercentage > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          {product.salePercentage}% OFF
                        </div>
                      )}
                      <img
                        src={mainImage}
                        alt={product.title}
                        className="w-full h-60 object-cover mb-3 rounded-md"
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />
                      <h3 className="font-semibold text-sm mb-1 line-clamp-1">{product.title}</h3>
                      <div className="flex items-baseline gap-2">
                        <p className="font-bold text-sm">{formatCurrency(product.price)}</p>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <p className="text-gray-500 text-xs line-through">
                            {formatCurrency(product.originalPrice)}
                          </p>
                        )}
                      </div>
                      {product.metalColors && product.metalColors.length > 0 && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                          Available in: {product.metalColors.join(", ")}
                        </p>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="col-span-3 text-center py-10 text-gray-500">
                  No products match your filters. Try adjusting your criteria.
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-6 space-x-2">
                <button
                  className="px-3 py-1 border rounded disabled:opacity-50"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 border rounded ${
                        pageNum === currentPage ? "bg-orange-500 text-white" : ""
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  className="px-3 py-1 border rounded disabled:opacity-50"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlassesList;