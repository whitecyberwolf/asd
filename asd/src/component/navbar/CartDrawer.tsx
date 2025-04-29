import React from "react";
import { useCart } from "../../contexts/CartContext";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<Props> = ({ open, onClose }) => {
  const { items, total, removeItem, clear } = useCart();
  const navigate = useNavigate();

  /* Helper to decide transform based on viewport */
  const baseClasses =
    "fixed bg-white shadow-lg transition-transform duration-300 z-50";

  const handleCheckout = () => {
    // Close the drawer and then navigate to checkout
    onClose();
    navigate("/checkout", {
      state: { cartItems: items, cartTotal: total },
    });
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
          <button onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          <p className="p-4 text-sm text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <div className="p-4 space-y-4 overflow-y-auto h-[60%] md:h-[70%]">
              {items.map((it) => (
                <div
                  key={
                    it.productId +
                    it.selectedColor +
                    it.selectedLength +
                    it.selectedWidth
                  }
                  className="flex gap-3"
                >
                  <img
                    src={it.image}
                    alt={it.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{it.name}</p>
                    <p className="text-xs text-gray-500">
                      {it.selectedLength && `${it.selectedLength} | `}
                      {it.selectedWidth && `${it.selectedWidth} | `}
                      {it.selectedColor}
                    </p>
                    <p className="text-sm">
                      {it.quantity} × ${it.price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(it.productId)}
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
              + <button
  className="w-full mt-4 py-2 bg-gray-900 text-white rounded"
  onClick={() => {
    // Navigate to checkout page
     window.location.href = "/checkout";
   }}
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
