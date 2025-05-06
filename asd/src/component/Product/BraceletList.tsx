"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import React from "react"

// Define the bracelet interface based on your MongoDB schema
interface PriceVariant {
  agateColor?: string
  metal?: string
  metalColor?: string
  color?: string
  price: number
  originalPrice?: number
}

interface Bracelet {
  _id: string
  productId: string
  name: string
  regularPrice: number
  salePrice: number
  discountPercentage?: number
  description: string
  details: {
    material?: string
    goldWeight?: string
    weight?: string
    stone?: string
    size?: string
    metal?: string
    width?: string
    thickness?: string
    clasp?: string
    length?: string
  }
  options: {
    agateColors?: string[]
    metals?: string[]
    metalColors?: string[]
    colors?: string[]
    sizes?: string[]
  }
  priceVariants: PriceVariant[]
  media: {
    images: string[]
    video: string | null
  }
}

/**
 * formatCurrency
 * Formats a number into currency format.
 */
function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount)
}

/**
 * getMinBraceletPrice
 * Finds the lowest price from the bracelet's pricing structure.
 */
function getMinBraceletPrice(product: Bracelet): number {
  // If there are price variants, find the minimum price
  if (product.priceVariants && product.priceVariants.length > 0) {
    const prices = product.priceVariants.map((variant) => variant.price)
    return Math.min(...prices)
  }

  // Otherwise use the sale price
  return product.salePrice
}

/**
 * getBraceletPrice
 * Returns the "display price" for a bracelet.
 */
function getBraceletPrice(product: Bracelet): number | string {
  try {
    return getMinBraceletPrice(product)
  } catch (error) {
    console.error("Error getting bracelet price:", error)
    return "Price Not Available"
  }
}

/**
 * getDiscountPercentage
 * Calculates the discount percentage if not already provided
 */
function getDiscountPercentage(product: Bracelet): number | null {
  if (product.discountPercentage) return product.discountPercentage

  if (product.regularPrice && product.salePrice && product.regularPrice > product.salePrice) {
    return Math.round(((product.regularPrice - product.salePrice) / product.regularPrice) * 100)
  }

  return null
}

const BraceletList = () => {
  const navigate = useNavigate()
  const FALLBACK_IMAGE = "/placeholder.svg?height=300&width=300"

  // -----------------------------------
  // State Variables
  // -----------------------------------
  const [allProducts, setAllProducts] = useState<Bracelet[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Bracelet[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Filters & Sorting
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000])
  const [sortOption, setSortOption] = useState("bestSelling")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMetal, setSelectedMetal] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")

  // Available filter options
  const [availableMetals, setAvailableMetals] = useState<string[]>([])
  const [availableColors, setAvailableColors] = useState<string[]>([])

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1)
  const productsPerPage = 9

  // -----------------------------------
  // Fetch Bracelets Data from Backend
  // -----------------------------------
  useEffect(() => {
    const fetchBracelets = async () => {
      try {
        // Update with your backend API URL
        const response = await axios.get("http://localhost:5000/api/bracelets")
        const bracelets = response.data as Bracelet[]
        setAllProducts(bracelets)
        setFilteredProducts(bracelets)

        // Extract available filter options
        const metals = new Set<string>()
        const colors = new Set<string>()

        bracelets.forEach((bracelet) => {
          // Add metals
          if (bracelet.options.metals) {
            bracelet.options.metals.forEach((metal) => metals.add(metal))
          }

          // Add colors (combining metalColors, agateColors and colors)
          if (bracelet.options.metalColors) {
            bracelet.options.metalColors.forEach((color) => colors.add(color))
          }
          if (bracelet.options.colors) {
            bracelet.options.colors.forEach((color) => colors.add(color))
          }
          if (bracelet.options.agateColors) {
            bracelet.options.agateColors.forEach((color) => colors.add(color))
          }
        })

        setAvailableMetals(Array.from(metals))
        setAvailableColors(Array.from(colors))
      } catch (err) {
        console.error("Error fetching bracelets:", err)
        setError("Something went wrong while fetching products.")
      } finally {
        setLoading(false)
      }
    }
    fetchBracelets()
  }, [])

  // -----------------------------------
  // Apply Filters, Search, and Sorting
  // -----------------------------------
  useEffect(() => {
    if (allProducts.length === 0) return
    let updated = [...allProducts]

    // Filter by Price Range
    updated = updated.filter((item) => {
      const price = getBraceletPrice(item)
      const numericPrice = typeof price === "number" ? price : 0
      return numericPrice >= priceRange[0] && numericPrice <= priceRange[1]
    })

    // Filter by Search Query (in name or description)
    if (searchQuery.trim() !== "") {
      const query = searchQuery.trim().toLowerCase()
      updated = updated.filter((item) => {
        return (
          (item.name && item.name.toLowerCase().includes(query)) ||
          (item.description && item.description.toLowerCase().includes(query))
        )
      })
    }

    // Filter by Metal
    if (selectedMetal) {
      updated = updated.filter(
        (item) =>
          item.options.metals?.includes(selectedMetal) ||
          item.priceVariants.some((variant) => variant.metal === selectedMetal),
      )
    }

    // Filter by Color (including metal colors, agate colors, and regular colors)
    if (selectedColor) {
      updated = updated.filter(
        (item) =>
          item.options.metalColors?.includes(selectedColor) ||
          item.options.colors?.includes(selectedColor) ||
          item.options.agateColors?.includes(selectedColor) ||
          item.priceVariants.some(
            (variant) =>
              variant.metalColor === selectedColor ||
              variant.color === selectedColor ||
              variant.agateColor === selectedColor,
          ),
      )
    }

    // Sorting
    if (sortOption === "lowToHigh") {
      updated.sort((a, b) => {
        const aPrice = getMinBraceletPrice(a)
        const bPrice = getMinBraceletPrice(b)
        return aPrice - bPrice
      })
    } else if (sortOption === "highToLow") {
      updated.sort((a, b) => {
        const aPrice = getMinBraceletPrice(a)
        const bPrice = getMinBraceletPrice(b)
        return bPrice - aPrice
      })
    } else if (sortOption === "discount") {
      updated.sort((a, b) => {
        const aDiscount = getDiscountPercentage(a) || 0
        const bDiscount = getDiscountPercentage(b) || 0
        return bDiscount - aDiscount
      })
    }
    // For "bestSelling", no sort is applied (assuming default order is best selling)

    setFilteredProducts(updated)
    setCurrentPage(1)
  }, [allProducts, priceRange, sortOption, searchQuery, selectedMetal, selectedColor])

  // -----------------------------------
  // Pagination Calculation
  // -----------------------------------
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const indexOfLast = currentPage * productsPerPage
  const indexOfFirst = indexOfLast - productsPerPage
  const currentItems = filteredProducts.slice(indexOfFirst, indexOfLast)

  // -----------------------------------
  // Clear All Filters
  // -----------------------------------
  const clearAllFilters = () => {
    setPriceRange([0, 50000])
    setSortOption("bestSelling")
    setSearchQuery("")
    setSelectedMetal("")
    setSelectedColor("")
  }

  // -----------------------------------
  // Navigate to Detail Page
  // -----------------------------------
  const handleProductClick = (productId: string) => {
    navigate(`/bracelet/${productId}`)
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin h-8 w-8 border-4 border-orange-600 rounded-full border-t-transparent"></div>
      </div>
    )

  if (error)
    return <div className="text-center text-red-500 mt-10 p-4 border border-red-200 rounded-md bg-red-50">{error}</div>

  return (
    <div className="max-w-screen-2xl mx-auto">
      {/* Banner Section */}
      <div
        className="w-full h-64 bg-cover bg-center flex items-center justify-center relative"
        style={{
          backgroundImage: `url(${FALLBACK_IMAGE})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative text-center text-white">
          <h2 className="text-3xl font-bold mb-2">Exclusive Bracelets Collection</h2>
          <p className="text-sm">Discover our luxurious range of bracelets</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 px-4">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-2">BRACELETS</h1>
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
                    const val = Number(e.target.value)
                    setPriceRange([val, priceRange[1]])
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
                    const val = Number(e.target.value)
                    setPriceRange([priceRange[0], val])
                  }}
                />
              </div>

              {/* Metal Filter */}
              {availableMetals.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm">Metal</h3>
                  <select
                    className="border p-1 w-full text-sm"
                    value={selectedMetal}
                    onChange={(e) => setSelectedMetal(e.target.value)}
                  >
                    <option value="">All Metals</option>
                    {availableMetals.map((metal) => (
                      <option key={metal} value={metal}>
                        {metal}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Color Filter */}
              {availableColors.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm">Color</h3>
                  <select
                    className="border p-1 w-full text-sm"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                  >
                    <option value="">All Colors</option>
                    {availableColors.map((color) => (
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
                  const priceValue = getBraceletPrice(product)
                  const discount = getDiscountPercentage(product)
                  const mainImage = product.media?.images?.[0] || FALLBACK_IMAGE

                  return (
                    <div
                      key={product._id}
                      className="border rounded-md bg-white shadow-sm hover:shadow-md transition p-3 relative cursor-pointer"
                      onClick={() => handleProductClick(product._id)}
                    >
                      {discount && discount > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          {discount}% OFF
                        </div>
                      )}
                      <img
                        src={mainImage || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-60 object-cover mb-3 rounded-md"
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMAGE
                        }}
                      />
                      <h3 className="font-semibold text-sm mb-1 line-clamp-1">{product.name}</h3>
                      <div className="flex items-baseline gap-2">
                        {typeof priceValue === "number" ? (
                          <>
                            <p className="font-bold text-sm">{formatCurrency(priceValue)}</p>
                            {product.regularPrice > product.salePrice && (
                              <p className="text-gray-500 text-xs line-through">
                                {formatCurrency(product.regularPrice)}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="font-bold text-sm">{priceValue}</p>
                        )}
                      </div>
                      {product.options?.metals && product.options.metals.length > 0 && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                          Available in: {product.options.metals.join(", ")}
                        </p>
                      )}
                    </div>
                  )
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
                  const pageNum = idx + 1
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 border rounded ${pageNum === currentPage ? "bg-orange-500 text-white" : ""}`}
                    >
                      {pageNum}
                    </button>
                  )
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
  )
}

export default BraceletList
