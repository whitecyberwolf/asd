import React, { createContext, useContext, useState } from "react";

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number; // single‑item price in dollars
  quantity: number;
  selectedLength?: string;
  selectedWidth?: string;
  selectedColor?: string;
}

interface CartContextProps {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  total: number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (it) =>
          it.productId === item.productId &&
          it.selectedLength === item.selectedLength &&
          it.selectedWidth === item.selectedWidth &&
          it.selectedColor === item.selectedColor
      );
      if (idx >= 0) {
        const clone = [...prev];
        clone[idx].quantity += item.quantity;
        return clone;
      }
      return [...prev, item];
    });
  };

  const removeItem = (productId: string) =>
    setItems((prev) => prev.filter((it) => it.productId !== productId));

  const clear = () => setItems([]);

  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clear, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
};