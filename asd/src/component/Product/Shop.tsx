// Example "Shop.tsx"
import React, { useState } from "react";
import ProductDetail from "./ProductDetails"; // the updated code above
import CartDrawer, { CartItem } from "../navbar/CartDrawer";

const Shop: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (newItem: CartItem) => {
    setCartItems((prev) => {
      // Check if item already exists in cart
      const existingIndex = prev.findIndex((i) => i.id === newItem.id);
      if (existingIndex !== -1) {
        // Update quantity if it’s the same item
        const updated = [...prev];
        updated[existingIndex].qty += newItem.qty;
        return updated;
      } else {
        return [...prev, newItem];
      }
    });
    setIsCartOpen(true); // open the drawer
  };

  return (
    <>
      <ProductDetail onAddToCart={handleAddToCart} />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onIncrement={(itemId) => {
          setCartItems((prev) =>
            prev.map((item) =>
              item.id === itemId ? { ...item, qty: item.qty + 1 } : item
            )
          );
        }}
        onDecrement={(itemId) => {
          setCartItems((prev) =>
            prev.map((item) =>
              item.id === itemId && item.qty > 1
                ? { ...item, qty: item.qty - 1 }
                : item
            )
          );
        }}
        onRemove={(itemId) => {
          setCartItems((prev) => prev.filter((item) => item.id !== itemId));
        }}
      />
    </>
  );
};

export default Shop;
