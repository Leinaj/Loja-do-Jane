// app/providers.tsx
'use client';

import React from 'react';
import { CartProvider } from '@/components/cart/context';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}