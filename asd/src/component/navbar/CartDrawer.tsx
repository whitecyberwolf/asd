// src/component/navbar/CartDrawer.tsx

import React from "react";
import { useCart } from "../../contexts/CartContext";
import { FaTimes } from "react-icons/fa";
import axios from "axios";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<Props> = ({ open, onClose }) => {
  const { items, total, removeItem, clear } = useCart();

  /* Helper to decide transform based on viewport */
  const baseClasses =
    "fixed bg-white shadow-lg transition-transform duration-300 z-50";

  // Create a Stripe Checkout Session and redirect the user
  const handleStripeCheckout = async () => {
    if (items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // Build line_items for Stripe
    const lineItems = items.map(it => ({
      price_data: {
        currency: "usd",
        product_data: { name: it.name },
        unit_amount: Math.round(it.price * 100), // convert dollars to cents
      },
      quantity: it.quantity,
    }));

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/checkout/create-checkout-session",
        {
          items: lineItems,
          successUrl: `${window.location.origin}/success`,
          cancelUrl:  `${window.location.origin}/cancel`,
        }
      );
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error", err);
      alert("Failed to initiate checkout. Please try again.");
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        } z-40`}
        onClick={onClose}
      />

      {/* Drawer (desktop right / mobile top) */}
      <div
        className={`
          ${baseClasses}
          /* Desktop */
          md:top-0 md:right-0 md:h-full md:w-80
          md:transform ${open ? "md:translate-x-0" : "md:translate-x-full"}
          /* Mobile */
          top-0 left-0 w-full h-[75vh]
          transform ${open ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button onClick={onClose} aria-label="Close cart drawer">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          <p className="p-4 text-sm text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <div className="p-4 space-y-4 overflow-y-auto h-[60%] md:h-[70%]">
              {items.map(it => (
                <div
                  key={it.id + JSON.stringify(it.variants || {})}
                  className="flex gap-3"
                >
                  <img
                    src={it.image}
                    alt={it.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{it.name}</p>
                    {it.variants && (
                      <p className="text-xs text-gray-500">
                        {it.variants.size && `${it.variants.size} | `}
                        {it.variants.color}
                      </p>
                    )}
                    <p className="text-sm">
                      {it.quantity} × ${it.price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(it.id, it.variants)}
                    className="text-xs text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t">
              <p className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </p>
              <button
                className="w-full mt-4 py-2 bg-gray-900 text-white rounded"
                onClick={handleStripeCheckout}
              >
                Checkout
              </button>
              <button
                className="w-full mt-2 text-xs underline text-gray-500"
                onClick={clear}
              >
                Clear cart
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
