// src/pages/CartCheckout.tsx
import React, { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CartCheckout: React.FC = () => {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Shipping form state
  const [shipping, setShipping] = useState({
    fullName: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  });

  // Update shipping form state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  // Handle checkout – call your backend
  const handleCheckout = async () => {
    if (items.length === 0) {
      alert("Your cart is empty");
      return;
    }
    setLoading(true);
    try {
      // Post the cart items and shipping details to your backend endpoint
      const res = await axios.post("http://localhost:5000/create-checkout-session-cart", {
        items,       // array of CartItem
        shipping,    // shipping details
        total,       // total price (in dollars) if needed
      });
      if (res.data.url) {
        // Optionally clear the cart after successful session creation
        clear();
        // Redirect to Stripe Checkout page
        window.location.href = res.data.url;
      } else {
        alert("No session URL returned from server.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Cart Checkout</h1>
      {/* Shipping Details Form */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Shipping Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            name="fullName"
            placeholder="Full Name"
            value={shipping.fullName}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="email"
            placeholder="Email"
            value={shipping.email}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="phone"
            placeholder="Phone"
            value={shipping.phone}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="line1"
            placeholder="Address Line 1"
            value={shipping.line1}
            onChange={handleChange}
            className="border p-2 rounded md:col-span-2"
          />
          <input
            name="line2"
            placeholder="Address Line 2"
            value={shipping.line2}
            onChange={handleChange}
            className="border p-2 rounded md:col-span-2"
          />
          <input
            name="city"
            placeholder="City"
            value={shipping.city}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="state"
            placeholder="State/Region"
            value={shipping.state}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="postalCode"
            placeholder="ZIP/Postal Code"
            value={shipping.postalCode}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="country"
            placeholder="Country"
            value={shipping.country}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
      </div>

      {/* Order Summary */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex justify-between">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 font-semibold">Total: ${total.toFixed(2)}</p>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full py-3 bg-orange-500 text-white rounded"
      >
        {loading ? "Processing..." : "Proceed to Payment"}
      </button>
    </div>
  );
};

export default CartCheckout;
