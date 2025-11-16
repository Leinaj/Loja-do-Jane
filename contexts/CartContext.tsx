// contexts/CartContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type ProductForCart = {
  id: number;
  slug: string;
  name: string;
  price: number;
  priceFormatted?: string;
  oldPrice?: number;
  oldPriceFormatted?: string;
  description?: string;
  image: string;
};

export type CartItem = ProductForCart & {
  quantity: number;
};

type CartContextData = {
  cart: CartItem[];
  items: CartItem[];             // 👈 Adicionado
  total: number;                 // 👈 Adicionado
  totalFormatted: string;        // 👈 Adicionado
  addToCart: (product: ProductForCart, quantity?: number) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
};

const CartContext = createContext<CartContextData | undefined>(undefined);

const STORAGE_KEY = "lojadojane-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Carrega o carrinho salvo no navegador
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CartItem[];
        setCart(parsed);
      }
    } catch (err) {
      console.error("Erro ao carregar carrinho:", err);
    }
  }, []);

  // Salva sempre que o carrinho muda
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error("Erro ao salvar carrinho:", err);
    }
  }, [cart]);

  function addToCart(product: ProductForCart, quantity: number = 1) {
    setCart((prev) => {
      const existing = prev.find((item) => item.slug === product.slug);

      if (!existing) {
        return [
          ...prev,
          {
            ...product,
            quantity,
          },
        ];
      }

      return prev.map((item) =>
        item.slug === product.slug
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    });
  }

  function removeFromCart(slug: string) {
    setCart((prev) => prev.filter((item) => item.slug !== slug));
  }

  function clearCart() {
    setCart([]);
  }

  function getCartTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  const total = getCartTotal();

  const totalFormatted = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <CartContext.Provider
      value={{
        cart,
        items: cart,        // 👈 compatível com quem usa "items"
        total,              // 👈 compatível com quem usa "total"
        totalFormatted,     // 👈 versão BRL
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart deve ser usado dentro de CartProvider");
  }
  return ctx;
}