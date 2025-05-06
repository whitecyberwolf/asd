import React from "react";
import { useCart } from "../contexts/CartContext";

const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        <p className="mt-4">Your cart is empty.</p>
      </div>
    );
  }

  // Calculate total
  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b pb-2"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover"
              />
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-gray-600">
                  ${item.price.toLocaleString("en-US")}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                className="px-2 py-1 border"
                onClick={() => decreaseQty(item.id)}
              >
                -
              </button>
              <span>{item.qty}</span>
              <button
                className="px-2 py-1 border"
                onClick={() => increaseQty(item.id)}
              >
                +
              </button>

              <button
                className="text-red-500 underline"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-xl font-bold">
          Total: ${totalAmount.toLocaleString("en-US")}
        </p>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={clearCart}
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default CartPage;
