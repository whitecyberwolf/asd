// ProductDetail.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import CartDrawer from "../navbar/CartDrawer";

// Adjust this interface to match your database schema
interface Product {
  _id: string;
  name: string;
  description: string;
  images: string[];   
  video: string;
  price: Record<string, Record<string, number>>;
  metalColour: string[];
  details: {
    diamond: string;
    clarity: string;
    cut?: string;
    width?: string;
    length?: string[];
    weight?: string;
    material?: string;
  };
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Product data
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string>("");


  const { addItem } = useCart();
const [drawerOpen, setDrawerOpen] = useState(false);

  // Product detail states
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedLength, setSelectedLength] = useState<string>("");
  const [selectedWidth, setSelectedWidth] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  // Recommended products
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

  // ========================
  // Fetch Product & Recommended
  // ========================
  useEffect(() => {
    // 1) Fetch main product
    const fetchProduct = async () => {
      try {
        const res = await axios.get<Product>(
          `http://localhost:5000/api/chains/${id}`
        );
        const data = res.data;
        setProduct(data);

        // Default selections
        setSelectedImage(data.images[0]);
        const defaultLength = Object.keys(data.price)[0];
        setSelectedLength(defaultLength);
        const defaultWidth = Object.keys(data.price[defaultLength])[0];
        setSelectedWidth(defaultWidth);
        setSelectedColor(data.metalColour[0]);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch product details");
      }
    };

    // 2) Fetch recommended products
    const fetchRecommended = async () => {
      try {
        const res = await axios.get<Product[]>(
          "http://localhost:5000/api/chains/recommended"
        );
        setRecommendedProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
    fetchRecommended();
  }, [id]);

  // ========================
  // Calculate Price
  // ========================
  const calculatePrice = () => {
    if (!product || !selectedLength || !selectedWidth) return 0;
    return product.price[selectedLength][selectedWidth] * quantity;
  };

  // Convert numeric price to display string
  const displayPrice = `$${calculatePrice().toLocaleString("en-US")}`;

  // ========================
  // Stripe Buy Now
  // ========================
  // const handleBuyNow = async () => {
  //   if (!product) return;

  //   try {
  //     // 1) total price in USD => convert to cents
  //     const totalUSD = calculatePrice();
  //     const amountInCents = Math.round(totalUSD * 100);

  //     // 2) Post to your server route /create-checkout-session
  //     const res = await axios.post("http://localhost:5000/create-checkout-session", {
  //       productId: product._id,
  //       productName: product.name,
  //       amount: amountInCents,
  //       quantity,
  //     });

  //     // 3) Redirect user to Stripe Checkout
  //     if (res.data.url) {
  //       window.location.href = res.data.url;
  //     } else {
  //       alert("No session URL returned from server");
  //     }
  //   } catch (err) {
  //     console.error("Error creating checkout session:", err);
  //     alert("Failed to start checkout");
  //   }
  // };
  const handleBuyNow = () => {
    navigate("/checkout", {
      state: {
        productId: product!._id,
        productName: product!.name,
        price: calculatePrice(),     // dollars
        quantity,
        selectedLength,
        selectedWidth,
        selectedColor,
      },
    });
  };
  

  // ========================
  // Render States
  // ========================
  if (error) {
    return <p className="text-red-500 text-center py-10">{error}</p>;
  }
  if (!product) {
    return <p className="text-center py-10">Loading...</p>;
  }

  // ========================
  // Render JSX
  // ========================
  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: Images & Video */}
        <div className="relative">
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-[500px] object-cover rounded-lg shadow-md mb-4"
          />

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx}`}
                className={`w-20 h-20 rounded cursor-pointer border-2 ${
                  selectedImage === img ? "border-gray-800" : "border-gray-200"
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>

          {/* Video */}
          {product.video && (
            <video controls className="mt-4 w-full rounded-lg shadow-md">
              <source src={product.video} type="video/mp4" />
              Your browser doesn't support video.
            </video>
          )}
        </div>

        {/* RIGHT: Product Info */}
        <div>
          <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
          <div className="flex items-baseline gap-2 mb-4">
            <p className="text-2xl font-bold text-gray-900">{displayPrice}</p>
            <span className="text-sm text-gray-500">(incl. of all taxes)</span>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Flexible and secure payment
          </p>

          {/* LENGTH */}
          <div className="mb-4">
            <h3 className="font-medium mb-1">Length</h3>
            <div className="flex gap-2">
              {Object.keys(product.price).map((length) => (
                <button
                  key={length}
                  onClick={() => setSelectedLength(length)}
                  className={`px-3 py-1 rounded border ${
                    selectedLength === length
                      ? "bg-gray-800 text-white"
                      : "border-gray-300"
                  }`}
                >
                  {length}
                </button>
              ))}
            </div>
          </div>

          {/* WIDTH */}
          <div className="mb-4">
            <h3 className="font-medium mb-1">Width</h3>
            <div className="flex gap-2">
              {Object.keys(product.price[selectedLength]).map((width) => (
                <button
                  key={width}
                  onClick={() => setSelectedWidth(width)}
                  className={`px-3 py-1 rounded border ${
                    selectedWidth === width
                      ? "bg-gray-800 text-white"
                      : "border-gray-300"
                  }`}
                >
                  {width}
                </button>
              ))}
            </div>
          </div>

          {/* COLOR */}
          <div className="mb-4">
            <h3 className="font-medium mb-1">Color</h3>
            <div className="flex gap-2">
              {product.metalColour.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1 rounded border ${
                    selectedColor === color
                      ? "bg-gray-800 text-white"
                      : "border-gray-300"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* QUANTITY */}
          <div className="mb-4">
            <h3 className="font-medium mb-1">Quantity</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-1 bg-gray-200 rounded"
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-4 py-1 bg-gray-200 rounded"
              >
                +
              </button>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4 mb-6">
          <button
  className="flex-1 py-3 bg-gray-900 text-white rounded"
  onClick={() => {
    addItem({
      productId: product!._id,
      name: product!.name,
      image: selectedImage,
      price: calculatePrice() / quantity,
      quantity,
      selectedLength,
      selectedWidth,
      selectedColor,
    });
    setDrawerOpen(true);
  }}
>
  Add to Cart
</button>
<CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
            <button
              onClick={handleBuyNow} // Stripe checkout call
              className="flex-1 py-3 bg-orange-500 text-white rounded"
            >
              Buy Now
            </button>
          </div>

          {/* DESCRIPTION */}
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* DETAILS */}
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Product Highlights</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Diamond: {product.details.diamond}</li>
              <li>Clarity: {product.details.clarity}</li>
              {product.details.cut && <li>Cut: {product.details.cut}</li>}
              {product.details.width && <li>Width: {product.details.width}</li>}
              {product.details.weight && <li>Weight: {product.details.weight}</li>}
              {product.details.material && (
                <li>Material: {product.details.material}</li>
              )}
            </ul>
          </div>

          {/* Guarantee Safe Checkout */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Guarantee Safe Checkout</h3>
            <div className="flex items-center gap-4">
              {/* Payment logos (placeholder) */}
              <img
                src="https://via.placeholder.com/50x30?text=PayPal"
                alt="PayPal"
              />
              <img
                src="https://via.placeholder.com/50x30?text=Stripe"
                alt="Stripe"
              />
              <img
                src="https://via.placeholder.com/50x30?text=Visa"
                alt="Visa"
              />
              <img
                src="https://via.placeholder.com/50x30?text=Mastercard"
                alt="Mastercard"
              />
            </div>
          </div>
        </div>
      </div>

      {/* YOU MAY ALSO LIKE */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">You may also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {recommendedProducts.map((item) => {
            // Quick price display from item
            const lengthKey = Object.keys(item.price)[0];
            const widthKey = Object.keys(item.price[lengthKey])[0];
            const itemPrice = item.price[lengthKey][widthKey];

            return (
              <div
                key={item._id}
                className="border p-4 text-center rounded hover:shadow-md cursor-pointer"
                onClick={() => navigate(`/product/${item._id}`)}
              >
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="mx-auto mb-2 w-full h-48 object-cover rounded"
                />
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-gray-600">
                  ${itemPrice.toLocaleString("en-US")}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
