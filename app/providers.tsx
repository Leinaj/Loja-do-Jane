'use client';

import React from 'react';

// 👇 note o ".." (sobe da pasta /app para a raiz)
import { CartProvider } from '../components/cart/context';
import ToastBridge from '../components/ui/toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ToastBridge />
      {children}
    </CartProvider>
  );
}