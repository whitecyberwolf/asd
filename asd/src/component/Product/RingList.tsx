import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

type Ring = {
  regularPrice: number;
  _id: string;
  name: string;
  price: number;
  image: string;
  details: {
    diamond: string;
  };
  options: {
    diamondTypes: string[];
  };
};

const RingList: React.FC = () => {
  const [rings, setRings] = useState<Ring[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>("default");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedDiamondTypes, setSelectedDiamondTypes] = useState<string[]>([]);
  const [allDiamondTypes, setAllDiamondTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchRings = async () => {
      try {
        const response = await axios.get<Ring[]>("http://localhost:5000/api/rings");
        setRings(response.data);
        
        // Extract all unique diamond types
        const diamondTypes = Array.from(
          new Set(
            response.data.flatMap(ring => 
              ring.options?.diamondTypes || 
              (ring.details?.diamond ? [ring.details.diamond] : [])
            )
          )
        );
        setAllDiamondTypes(diamondTypes);
      } catch (err) {
        console.error(err);
        setError("Failed to load rings");
      } finally {
        setLoading(false);
      }
    };

    fetchRings();
  }, []);

  // Handle sorting and filtering
  const filteredRings = rings.filter(ring => {
    // Price filter
    const priceInRange = ring.price >= priceRange[0] && ring.price <= priceRange[1];
    
    // Diamond type filter
    const diamondTypeMatch = selectedDiamondTypes.length === 0 || 
      (ring.options?.diamondTypes 
        ? ring.options.diamondTypes.some(type => selectedDiamondTypes.includes(type))
        : selectedDiamondTypes.includes(ring.details?.diamond || ""));
    
    return priceInRange && diamondTypeMatch;
  });

  const sortedRings = [...filteredRings].sort((a, b) => {
    switch (sortOption) {
      case "lowToHigh":
        return a.price - b.price;
      case "highToLow":
        return b.price - a.price;
      case "newest":
        return b._id.localeCompare(a._id);
      default:
        return 0;
    }
  });

  const handleDiamondTypeChange = (type: string) => {
    setSelectedDiamondTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = parseInt(e.target.value);
    setPriceRange(prev => {
      const newRange = [...prev] as [number, number];
      newRange[index] = value;
      return newRange;
    });
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Diamond Rings</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 space-y-6">
          {/* Price Range Filter */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-lg mb-4">Price Range</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceRangeChange(e, 0)}
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceRangeChange(e, 1)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Diamond Type Filter */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-lg mb-4">Diamond Type</h3>
            <div className="space-y-2">
              {allDiamondTypes.map((type) => (
                <div key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`diamond-${type}`}
                    checked={selectedDiamondTypes.includes(type)}
                    onChange={() => handleDiamondTypeChange(type)}
                    className="mr-2"
                  />
                  <label htmlFor={`diamond-${type}`}>{type}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Bar: Count + Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="text-lg font-medium text-gray-700">
              Showing {filteredRings.length} Rings
            </div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
            >
              <option value="default">Sort by</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedRings.map((ring) => (
              <Link
                to={`/rings/${ring._id}`}
                key={ring._id}
                className="border rounded-xl p-4 shadow-sm hover:shadow-lg transition cursor-pointer text-center"
              >
                <img
                  src={ring.image}
                  alt={ring.name}
                  className="w-full h-64 object-cover rounded-md mb-4"
                />
                <h3 className="text-lg font-medium text-gray-800 mb-1">
                  {ring.name}
                </h3>
                <div className="flex justify-center gap-2 items-center">
                  <span className="text-gray-500 line-through text-sm">
                    ₹{ring.regularPrice}
                  </span>
                  <span className="text-orange-600 font-semibold text-lg">
                    ₹{ring.price}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RingList;