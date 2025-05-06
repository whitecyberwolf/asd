// src/component/Product/WatchesList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/**
 * formatDollars
 * Formats a number into US Dollar currency format.
 */
function formatDollars(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * getWatchPrice
 * Returns the effective price for filtering and display.
 * If the product has a salePrice, it returns that; otherwise returns the regularPrice.
 */
function getWatchPrice(product) {
  if (!product.price) return 0;
  return product.price.salePrice || product.price.regularPrice || 0;
}

/**
 * getDiscountPercent
 * Returns the discount percentage if available; otherwise returns 0.
 */
function getDiscountPercent(product) {
  if (
    product.price &&
    product.price.salePrice &&
    product.price.regularPrice &&
    product.price.regularPrice > product.price.salePrice
  ) {
    return (
      product.price.salePercentage ||
      Math.round(
        ((product.price.regularPrice - product.price.salePrice) / product.price.regularPrice) * 100
      )
    );
  }
  return 0;
}

const WatchesList = () => {
  const navigate = useNavigate();
  const FALLBACK_IMAGE = "https://dummyimage.com/300x300/ddd/000.png&text=No+Image";

  // State Variables
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Sorting States
  const [priceRange, setPriceRange] = useState([0, 5000]); // in USD
  const [sortOption, setSortOption] = useState("bestSelling");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  // Fetch Watches Data from MongoDB via your Express endpoint
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/watches");
        setAllProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        console.error("Error fetching watches:", err);
        setError("Something went wrong while fetching products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Apply Filters, Search, and Sorting
  useEffect(() => {
    if (allProducts.length === 0) return;
    let updated = [...allProducts];

    // Filter by Price Range
    updated = updated.filter((item) => {
      const price = getWatchPrice(item);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Filter by Search Query (checks in product name and brand)
    if (searchQuery.trim() !== "") {
      const query = searchQuery.trim().toLowerCase();
      updated = updated.filter((item) => {
        const nameMatch = item.name && item.name.toLowerCase().includes(query);
        const brandMatch = item.brand && item.brand.toLowerCase().includes(query);
        return nameMatch || brandMatch;
      });
    }

    // Sorting
    if (sortOption === "lowToHigh") {
      updated.sort((a, b) => getWatchPrice(a) - getWatchPrice(b));
    } else if (sortOption === "highToLow") {
      updated.sort((a, b) => getWatchPrice(b) - getWatchPrice(a));
    } else if (sortOption === "discount") {
      updated.sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a));
    }
    // For "bestSelling", leave order unchanged.

    setFilteredProducts(updated);
    setCurrentPage(1); // Reset pagination when filters change
  }, [allProducts, priceRange, sortOption, searchQuery]);

  // Pagination Calculations
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirst, indexOfLast);

  // Clear All Filters Handler
  const clearAllFilters = () => {
    setPriceRange([0, 5000]);
    setSortOption("bestSelling");
    setSearchQuery("");
  };

  if (loading) return <p className="text-center py-10">Loading products...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;

  return (
    <div className="max-w-screen-2xl mx-auto py-8 px-4">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-2">DIAMOND WATCHES</h1>
      <p className="text-gray-600 text-sm mb-6">{filteredProducts.length} Products</p>

      <div className="flex gap-6">
        {/* Sidebar: Filters */}
        <aside className="w-64 shrink-0">
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
                placeholder="Search by name or brand"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Price Range Filter */}
            <div>
              <h3 className="font-semibold mb-2 text-sm">Price ($)</h3>
              <label className="block text-xs text-gray-700" htmlFor="minPrice">
                Min Price
              </label>
              <input
                id="minPrice"
                type="number"
                className="border p-1 w-full text-sm mb-2"
                value={priceRange[0]}
                placeholder="Enter minimum price"
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              />
              <label className="block text-xs text-gray-700" htmlFor="maxPrice">
                Max Price
              </label>
              <input
                id="maxPrice"
                type="number"
                className="border p-1 w-full text-sm"
                value={priceRange[1]}
                placeholder="Enter maximum price"
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              />
            </div>
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
            {currentItems.map((product) => {
              const mainImage =
                product.imageUrls &&
                product.imageUrls.length > 0 &&
                product.imageUrls[0].startsWith("http")
                  ? product.imageUrls[0]
                  : FALLBACK_IMAGE;
              const hasSale = product.price && product.price.salePrice;
              const discountPercent = getDiscountPercent(product);
              const brandName = product.brand || "DEFAULT BRAND";
              return (
                <div key={product._id} className="border rounded-md bg-white shadow-sm hover:shadow-md transition p-3 relative">
                  {/* Discount Badge */}
                  {hasSale && (
                    <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      Sale - {discountPercent}%
                    </span>
                  )}
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-60 object-cover mb-3"
                    onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                  />
                  <p className="text-xs text-gray-500 uppercase mb-1">{brandName}</p>
                  <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                  <div className="flex items-center space-x-2">
                    {hasSale ? (
                      <>
                        <p className="text-red-600 font-bold text-sm">{formatDollars(product.price.salePrice)}</p>
                        <p className="text-gray-500 line-through text-xs">{formatDollars(product.price.regularPrice)}</p>
                      </>
                    ) : (
                      <p className="font-bold text-sm">{formatDollars(product.price.regularPrice)}</p>
                    )}
                  </div>
                  <button
                    onClick={() => navigate(`/watch/${product._id}`)}
                    className="mt-3 w-full py-2 text-center text-sm bg-[#9c7a56] text-white rounded hover:bg-[#7c5f47] transition"
                  >
                    View Details
                  </button>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
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
                  className={`px-3 py-1 border rounded ${pageNum === currentPage ? "bg-[#9c7a56] text-white" : ""}`}
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
        </div>
      </div>
    </div>
  );
};

export default WatchesList;
