'use client';

import { CartProvider } from '../lib/cart';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}