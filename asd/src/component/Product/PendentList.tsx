import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/**
 * formatDollars
 * Formats a number into US Dollar currency format.
 */
function formatDollars(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * getMinPendantPrice
 * Finds the lowest price across your pendant object's pricing structure.
 */
function getMinPendantPrice(product: any): number | null {
  if (typeof product.price === "number") {
    return product.price;
  }
  if (typeof product.price === "object") {
    let minPrice: number | null = null;
    for (const key in product.price) {
      const val = product.price[key];
      if (typeof val === "number") {
        if (minPrice === null || val < minPrice) {
          minPrice = val;
        }
      }
    }
    return minPrice;
  }
  return null;
}

/**
 * getPendantPrice
 * Returns the "display price" for a pendant by scanning any price fields.
 * If none found, returns "Price Not Available".
 */
function getPendantPrice(product: any): number | string {
  const minPrice = getMinPendantPrice(product);
  if (minPrice === null) return "Price Not Available";
  return minPrice;
}

const PendantList: React.FC = () => {
  const navigate = useNavigate();
  const FALLBACK_IMAGE = "https://dummyimage.com/300x300/ddd/000.png&text=No+Image";

  // State Variables
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Sorting
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortOption, setSortOption] = useState("bestSelling");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 9;

  // Fetch pendants data from backend
  useEffect(() => {
    const fetchPendants = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/pendants");
        setAllProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        console.error("Error fetching pendants from MongoDB:", err);
        setError("Something went wrong while fetching products.");
      } finally {
        setLoading(false);
      }
    };
    fetchPendants();
  }, []);

  // Apply Filters, Search, and Sorting
  useEffect(() => {
    if (allProducts.length === 0) return;
    let updated = [...allProducts];

    // 1) Filter by Price Range
    updated = updated.filter((item) => {
      const price = getPendantPrice(item);
      const numericPrice = typeof price === "number" ? price : 0;
      return numericPrice >= priceRange[0] && numericPrice <= priceRange[1];
    });

    // 2) Filter by Search Query (in name)
    if (searchQuery.trim() !== "") {
      const query = searchQuery.trim().toLowerCase();
      updated = updated.filter((item) => item.name && item.name.toLowerCase().includes(query));
    }

    // 3) Sorting
    if (sortOption === "lowToHigh") {
      updated.sort((a, b) => +getPendantPrice(a) - +getPendantPrice(b));
    } else if (sortOption === "highToLow") {
      updated.sort((a, b) => +getPendantPrice(b) - +getPendantPrice(a));
    }
    // bestSelling -> no additional sort

    setFilteredProducts(updated);
    setCurrentPage(1); // Reset pagination when filters change
  }, [allProducts, priceRange, sortOption, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirst, indexOfLast);

  // Clear all filters
  const clearAllFilters = () => {
    setPriceRange([0, 5000]);
    setSortOption("bestSelling");
    setSearchQuery("");
  };

  if (loading) return <p className="text-center py-10">Loading products...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;

  return (
    <div className="max-w-screen-2xl mx-auto">
      {/* Banner Section */}
      <div
        className="w-full h-64 bg-cover bg-center flex items-center justify-center relative"
        style={{
          backgroundImage:
            "url('https://dummyimage.com/1600x400/000/fff.png&text=Banner')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative text-center text-yellow-400">
          <h2 className="text-3xl font-bold mb-2 uppercase tracking-wider">
            Stylish Pendants Collection
          </h2>
          <p className="text-sm text-yellow-300">
            Discover our exquisite range of pendants
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 px-4">
        {/* Header */}
        <h1 className="text-2xl font-bold uppercase mb-2 tracking-wider">
          PENDANTS
        </h1>
        <p className="text-gray-600 text-sm mb-6">
          {filteredProducts.length} Products
        </p>

        <div className="flex gap-6">
          {/* Sidebar: Filters */}
          <aside className="w-64 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg uppercase tracking-wider">
                Filters
              </h2>
              <button onClick={clearAllFilters} className="text-sm text-yellow-600 hover:underline">
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
                <h3 className="font-semibold mb-2 text-sm">Price ($)</h3>
                <label className="block text-xs text-gray-700" htmlFor="minPrice">
                  Min Price
                </label>
                <input
                  id="minPrice"
                  type="number"
                  className="border p-1 w-full text-sm mb-2"
                  value={priceRange[0]}
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
                <option value="bestSelling">Best Selling</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((product) => {
                const priceValue = getPendantPrice(product);
                const mainImage = product.images?.[0] || FALLBACK_IMAGE;
                return (
                  <div
                    key={product._id}
                    className="border rounded-md bg-white shadow-sm hover:shadow-md transform hover:scale-105 transition duration-300 p-3 relative cursor-pointer"
                    onClick={() => navigate(`/pendant/${product._id}`)}
                  >
                    <img
                      src={mainImage}
                      alt={product.name}
                      className="w-full h-60 object-cover mb-3 rounded-md"
                      onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                    />
                    <h3 className="font-semibold text-sm mb-1 text-gray-800">
                      {product.name}
                    </h3>
                    {typeof priceValue === "number" ? (
                      <p className="font-bold text-sm text-yellow-600">
                        {formatDollars(priceValue)}
                      </p>
                    ) : (
                      <p className="font-bold text-sm text-yellow-600">{priceValue}</p>
                    )}
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
                    className={`px-3 py-1 border rounded ${
                      pageNum === currentPage ? "bg-[#9c7a56] text-white" : ""
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendantList;
