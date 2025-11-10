// components/Providers.tsx
'use client';

import { CartProvider } from '@/components/cart/context';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}