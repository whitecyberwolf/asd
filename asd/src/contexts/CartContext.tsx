// src/contexts/CartContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

//////////////////////
// 1. Types & Interfaces
//////////////////////

export interface CartItem {
  productId?: string; // Added productId as an optional property
  /** Product ID */
  id: string;
  name: string;
  image: string;
  /** Final unit price (including selected variants) */
  price: number;
  quantity: number;
  /** Selected variants */
  selectedSize?: string; 
  selectedColor: string;
  variants?: {
    size?: string;
    metalType?: string;
    diamondType?: string;
    color?: string;
  };
}

interface CartContextProps {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, variants?: CartItem["variants"]) => void;
  clear: () => void;
  /** Sum of price * quantity for all items */
  total: number;
}

//////////////////////
// 2. Context & Provider
//////////////////////

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize from localStorage if available
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? (JSON.parse(stored) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  /** Add a new item or merge quantity if same product+variants */
  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (it) =>
          it.id === item.id &&
          JSON.stringify(it.variants) === JSON.stringify(item.variants)
      );
      if (idx > -1) {
        const clone = [...prev];
        clone[idx].quantity += item.quantity;
        return clone;
      }
      return [...prev, item];
    });
  };

  /**
   * Remove an item by product ID + optional variants.
   * If variants is omitted, removes *all* matching product IDs.
   */
  const removeItem = (id: string, variants?: CartItem["variants"]) => {
    setItems((prev) =>
      prev.filter(
        (it) =>
          !(
            it.id === id &&
            (variants == null ||
              JSON.stringify(it.variants) === JSON.stringify(variants))
          )
      )
    );
  };

  /** Clear the entire cart */
  const clear = () => {
    setItems([]);
  };

  /** Total price of all items */
  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clear, total }}
    >
      {children}
    </CartContext.Provider>
  );
};

//////////////////////
// 3. Hook to consume the cart
//////////////////////

export const useCart = (): CartContextProps => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a <CartProvider>");
  }
  return ctx;
};
