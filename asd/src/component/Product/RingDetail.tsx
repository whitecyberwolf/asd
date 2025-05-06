"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"

interface PriceVariant {
  metals: string
  diamond: string
  ringSize: number
  price: number
}

interface RingOptions {
  metals: string[]
  diamondTypes: string[]
  ringSizes: number[]
}

interface RingDetails {
  diamond: string
  cut: string
  clarity: string
  carats: string
  material: string
  goldWeight: string
  width: string
}

interface Ring {
  _id: string
  productId: string
  name: string
  description: string
  regularPrice: number
  options: RingOptions
  priceVariants: PriceVariant[]
  details: RingDetails
  media?: {
    images: string[]
    video?: string
  }
}

const RingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [ring, setRing] = useState<Ring | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Selection states
  const [selectedMetal, setSelectedMetal] = useState<string>("")
  const [selectedDiamond, setSelectedDiamond] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<number | null>(null)
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [metalGroup, setMetalGroup] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1) // NEW: Quantity state

  useEffect(() => {
    const fetchRing = async () => {
      try {
        const response = await axios.get<Ring>(`http://localhost:5000/api/rings/${id}`)
        setRing(response.data)

        // Set default selections
        if (response.data.options.metals.length > 0) {
          const firstMetal = response.data.options.metals[0]
          setSelectedMetal(firstMetal)

          // Determine metal group
          if (
            firstMetal.includes("10K Yellow Gold") ||
            firstMetal.includes("10K White Gold") ||
            firstMetal.includes("10K Rose Gold")
          ) {
            setMetalGroup("10K Yellow Gold, 10K White Gold, 10K Rose Gold")
          } else {
            setMetalGroup("925 Yellow, 925 Rose, 925 White Color Gold")
          }
        }

        if (response.data.options.diamondTypes.length > 0) {
          setSelectedDiamond(response.data.options.diamondTypes[0])
        }

        if (response.data.options.ringSizes.length > 0) {
          setSelectedSize(response.data.options.ringSizes[0])
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to load ring details.")
        } else {
          setError("An unexpected error occurred.")
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchRing()
    }
  }, [id])

  // Update price when selections change
  useEffect(() => {
    if (ring && selectedMetal && selectedDiamond && selectedSize !== null) {
      // Determine metal group based on selection
      let newMetalGroup = ""
      
      if (
        selectedMetal.includes("10K Yellow Gold") ||
        selectedMetal.includes("10K White Gold") ||
        selectedMetal.includes("10K Rose Gold")
      ) {
        newMetalGroup = "10K Yellow Gold, 10K White Gold, 10K Rose Gold"
      } else if (
        selectedMetal.includes("925 Yellow Color Gold") ||
        selectedMetal.includes("925 Rose Color Gold") ||
        selectedMetal.includes("925 White Color Gold")
      ) {
        newMetalGroup = "925 Yellow, 925 Rose, 925 White Color Gold"
      }

      setMetalGroup(newMetalGroup)

      // Find matching price variant
      const matchingVariant = ring.priceVariants.find(
        (variant) =>
          variant.metals === newMetalGroup && 
          variant.diamond === selectedDiamond && 
          variant.ringSize === selectedSize
      )

      if (matchingVariant) {
        setCurrentPrice(matchingVariant.price)
      } else {
        // Fallback to regular price if no variant found
        setCurrentPrice(ring.regularPrice)
      }
    }
  }, [ring, selectedMetal, selectedDiamond, selectedSize])

  const handleAddToCart = () => {
    if (!ring || currentPrice === null) return

    const selectedVariant = {
      id: ring._id,
      productId: ring.productId,
      name: ring.name,
      metal: selectedMetal,
      diamond: selectedDiamond,
      ringSize: selectedSize,
      price: currentPrice,
    }

    console.log("Added to cart:", selectedVariant)
    // Replace with actual cart logic
  }

  // UPDATED: Buy Now function includes quantity and navigates to checkout similar to ProductDetail
  const handleBuyNow = () => {
    if (!ring || currentPrice === null) return

    const totalPrice = currentPrice * quantity

    const selectedVariant = {
      id: ring._id,
      productId: ring.productId,
      name: ring.name,
      metal: selectedMetal,
      diamond: selectedDiamond,
      ringSize: selectedSize,
      price: totalPrice,
      quantity
    }

    console.log("Buy Now clicked:", selectedVariant)
    // Redirect to checkout with selected variant details
    navigate("/checkout", { state: { product: selectedVariant } })
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin h-8 w-8 border-4 border-orange-600 rounded-full border-t-transparent"></div>
      </div>
    )

  if (error)
    return <div className="text-center text-red-500 mt-10 p-4 border border-red-200 rounded-md bg-red-50">{error}</div>

  if (!ring) return null

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          {ring.media?.images && ring.media.images.length > 0 ? (
            <img
              src={ring.media.images[0] || "/placeholder.svg"}
              alt={`Image of ${ring.name}`}
              className="w-full h-[500px] object-cover rounded-xl shadow-md"
            />
          ) : (
            <div className="h-[500px] w-full rounded-xl shadow-md bg-gray-100 flex items-center justify-center">
              <p className="text-gray-400">No image available</p>
            </div>
          )}
          {/* Thumbnail gallery would go here */}
        </div>

        <div className="flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-gray-800">{ring.name}</h1>
              <p className="text-gray-600">{ring.description || "No description available."}</p>
            </div>

            <div className="flex gap-3 items-center">
              {ring.regularPrice && currentPrice !== ring.regularPrice && (
                <span className="text-gray-400 line-through text-lg">
                  ₹{ring.regularPrice.toLocaleString("en-IN")}
                </span>
              )}
              <span className="text-orange-600 text-2xl font-bold">
                ₹{currentPrice?.toLocaleString("en-IN") || "Price unavailable"}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Metal</label>
                <select
                  value={selectedMetal}
                  onChange={(e) => setSelectedMetal(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black-800"
                >
                  {ring.options.metals.map((metal) => (
                    <option key={metal} value={metal}>
                      {metal}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diamond Type</label>
                <select
                  value={selectedDiamond}
                  onChange={(e) => setSelectedDiamond(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  {ring.options.diamondTypes.map((diamond) => (
                    <option key={diamond} value={diamond}>
                      {diamond}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ring Size</label>
                <select
                  value={selectedSize?.toString() || ""}
                  onChange={(e) => setSelectedSize(Number.parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  {ring.options.ringSizes.map((size) => (
                    <option key={size} value={size.toString()}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
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

          <div className="mt-8 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3">Product Details</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              {Object.entries(ring.details).map(([key, value]) => (
                <React.Fragment key={key}>
                  <div className="text-gray-500 capitalize">{key}</div>
                  <div>{value}</div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RingDetail

