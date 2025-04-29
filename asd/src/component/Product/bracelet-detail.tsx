"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import React from "react"

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

const BraceletDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [bracelet, setBracelet] = useState<Bracelet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Selection states
  const [selectedMetal, setSelectedMetal] = useState<string>("")
  const [selectedMetalColor, setSelectedMetalColor] = useState<string>("")
  const [selectedAgateColor, setSelectedAgateColor] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [currentOriginalPrice, setCurrentOriginalPrice] = useState<number>(0)
  
  // NEW: Quantity state – defaults to 1
  const [quantity, setQuantity] = useState<number>(1)

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Helper function to get price difference for an option
  const getPriceDifference = (optionType: string, optionValue: string) => {
    if (!bracelet) return ""
    
    const variant = bracelet.priceVariants.find(v => 
      v[optionType as keyof PriceVariant] === optionValue
    )
    
    if (variant && variant.price !== bracelet.salePrice) {
      const difference = variant.price - bracelet.salePrice
      return difference > 0 
        ? `(+${formatCurrency(difference)})` 
        : `(${formatCurrency(difference)})`
    }
    return ""
  }

  useEffect(() => {
    const fetchBracelet = async () => {
      try {
        const response = await axios.get<Bracelet>(`http://localhost:5000/api/bracelets/${id}`)
        const data = response.data
        setBracelet(data)

        // Set default selections if needed:
        // Uncomment and adjust these lines if you want to initialize the default option values.
        // if (data.options.metals?.length > 0) {
        //   setSelectedMetal(data.options.metals[0])
        // }
        // if (data.options.metalColors?.length > 0) {
        //   setSelectedMetalColor(data.options.metalColors[0])
        // }
        // if (data.options.agateColors?.length > 0) {
        //   setSelectedAgateColor(data.options.agateColors[0])
        // }
        // if (data.options.colors?.length > 0) {
        //   setSelectedColor(data.options.colors[0])
        // }
        // if (data.options.sizes?.length > 0) {
        //   setSelectedSize(data.options.sizes[0])
        // }

        // Set initial prices
        setCurrentPrice(data.salePrice)
        setCurrentOriginalPrice(data.regularPrice)
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to load bracelet details.")
        } else {
          setError("An unexpected error occurred.")
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchBracelet()
    }
  }, [id])

  // Update price when selections change
  useEffect(() => {
    if (!bracelet) return

    // Find the best matching price variant
    let bestMatch: PriceVariant | null = null
    let highestMatchScore = -1

    bracelet.priceVariants.forEach((variant) => {
      let matchScore = 0
      let totalPossibleMatches = 0

      // Check each possible option
      if (variant.metal) {
        totalPossibleMatches++
        if (variant.metal === selectedMetal) matchScore++
      }
      if (variant.metalColor) {
        totalPossibleMatches++
        if (variant.metalColor === selectedMetalColor) matchScore++
      }
      if (variant.agateColor) {
        totalPossibleMatches++
        if (variant.agateColor === selectedAgateColor) matchScore++
      }
      if (variant.color) {
        totalPossibleMatches++
        if (variant.color === selectedColor) matchScore++
      }

      // If this variant matches more options than our current best match
      if (matchScore > highestMatchScore || 
          (matchScore === highestMatchScore && variant.price < (bestMatch?.price || Infinity))) {
        bestMatch = variant
        highestMatchScore = matchScore
      }
    })

    // If we found a match with at least one matching option, use it
    if (bestMatch && highestMatchScore > 0) {
      // You could update prices here if you want to reflect specific variant pricing.
      // For example:
      // setCurrentPrice(bestMatch.price)
      // setCurrentOriginalPrice(bestMatch.originalPrice || bracelet.regularPrice)
    } else {
      // Otherwise fall back to base prices
      setCurrentPrice(bracelet.salePrice)
      setCurrentOriginalPrice(bracelet.regularPrice)
    }
  }, [bracelet, selectedMetal, selectedMetalColor, selectedAgateColor, selectedColor])

  const handleAddToCart = () => {
    if (!bracelet) return

    const selectedVariant = {
      productId: bracelet._id,
      productName: bracelet.name,
      metal: selectedMetal,
      metalColor: selectedMetalColor,
      agateColor: selectedAgateColor,
      color: selectedColor,
      size: selectedSize,
      // Pass the unit price here (if you wish to calculate totals later, multiply by quantity)
      price: currentPrice,
      originalPrice: currentOriginalPrice,
      image: bracelet.media.images[0] || "",
      quantity, // You can also add quantity here if needed
    }

    console.log("Added to cart:", selectedVariant)
    // Replace with actual cart logic
    alert(`${bracelet.name} added to cart!`)
  }

  // UPDATED: Updated buy now function to mirror ProductDetail behavior
  const handleBuyNow = () => {
    if (!bracelet) return

    // Calculate total price based on selected quantity
    const totalPrice = currentPrice * quantity

    const selectedVariant = {
      productId: bracelet._id,
      productName: bracelet.name,
      metal: selectedMetal,
      metalColor: selectedMetalColor,
      agateColor: selectedAgateColor,
      color: selectedColor,
      size: selectedSize,
      price: totalPrice,
      quantity,
      image: bracelet.media.images[0] || "",
    }

    console.log("Buy Now clicked:", selectedVariant)
    // Navigate to checkout with the selected variant state
    navigate("/checkout", { state: selectedVariant })
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin h-8 w-8 border-4 border-orange-600 rounded-full border-t-transparent"></div>
      </div>
    )

  if (error)
    return <div className="text-center text-red-500 mt-10 p-4 border border-red-200 rounded-md bg-red-50">{error}</div>

  if (!bracelet) return null

  // Calculate discount percentage
  const discountPercentage = currentOriginalPrice > currentPrice
    ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
    : 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Column - Images */}
        <div className="space-y-4">
          {bracelet.media?.images && bracelet.media.images.length > 0 ? (
            <div className="relative h-[500px] w-full rounded-xl shadow-md overflow-hidden">
              <img
                src={bracelet.media.images[currentImageIndex] || "/placeholder.svg"}
                alt={`Image of ${bracelet.name}`}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-[500px] w-full rounded-xl shadow-md bg-gray-100 flex items-center justify-center">
              <p className="text-gray-400">No image available</p>
            </div>
          )}

          {/* Thumbnail gallery */}
          {bracelet.media?.images && bracelet.media.images.length > 1 && (
            <div className="flex gap-4 items-start overflow-x-auto pb-2">
              {bracelet.media.images.map((image, index) => (
                <button
                  key={index}
                  className={`border rounded-lg overflow-hidden transition-colors ${
                    index === currentImageIndex ? "border-orange-500" : "hover:border-gray-400"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Preview thumbnail ${index + 1}`}
                    className="w-20 h-20 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                  />
                  <span className="sr-only">View Image {index + 1}</span>
                </button>
              ))}
            </div>
          )}

          {/* Video if available */}
          {bracelet.media?.video && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Product Video</h3>
              <video
                src={bracelet.media.video}
                controls
                className="w-full rounded-lg"
                poster={bracelet.media.images[0] || "/placeholder.svg"}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>

        {/* Right Column - Product Details */}
        <div className="flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-gray-800">{bracelet.name}</h1>
              <p className="text-gray-600">{bracelet.description}</p>
            </div>

            <div className="flex gap-3 items-center">
              {currentOriginalPrice > currentPrice && (
                <span className="text-gray-400 line-through text-lg">
                  {formatCurrency(currentOriginalPrice)}
                </span>
              )}
              <span className="text-orange-600 text-2xl font-bold">
                {formatCurrency(currentPrice)}
              </span>
              {discountPercentage > 0 && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {discountPercentage}% OFF
                </span>
              )}
            </div>

            <div className="space-y-4">
              {/* Metal Selection */}
              {bracelet.options.metals && bracelet.options.metals.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Metal</label>
                  <select
                    value={selectedMetal}
                    onChange={(e) => setSelectedMetal(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {bracelet.options.metals.map((metal) => (
                      <option key={metal} value={metal}>
                        {metal} {getPriceDifference('metal', metal)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Metal Color Selection */}
              {bracelet.options.metalColors && bracelet.options.metalColors.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Metal Color</label>
                  <select
                    value={selectedMetalColor}
                    onChange={(e) => setSelectedMetalColor(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {bracelet.options.metalColors.map((color) => (
                      <option key={color} value={color}>
                        {color} {getPriceDifference('metalColor', color)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Agate Color Selection */}
              {bracelet.options.agateColors && bracelet.options.agateColors.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Agate Color</label>
                  <select
                    value={selectedAgateColor}
                    onChange={(e) => setSelectedAgateColor(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {bracelet.options.agateColors.map((color) => (
                      <option key={color} value={color}>
                        {color} {getPriceDifference('agateColor', color)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Color Selection */}
              {bracelet.options.colors && bracelet.options.colors.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {bracelet.options.colors.map((color) => (
                      <option key={color} value={color}>
                        {color} {getPriceDifference('color', color)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Size Selection */}
              {bracelet.options.sizes && bracelet.options.sizes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {bracelet.options.sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* NEW: Quantity Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-4 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-white border border-gray-400 text-gray-800 font-semibold px-6 py-3 rounded-md hover:bg-gray-100 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-orange-400 text-white font-semibold px-6 py-3 rounded-md hover:bg-orange-500 transition"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="mt-8 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3">Product Details</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              {Object.entries(bracelet.details)
                .filter(([_, value]) => value) // Only show details that have values
                .map(([key, value]) => (
                  <div key={key} className="contents">
                    <div className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</div>
                    <div>{value}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BraceletDetail
