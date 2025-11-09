'use client';

import React from 'react';
import { CartProvider } from '@/app/components/cart/context';
import ToastBridge from '@/app/components/ui/toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ToastBridge />
      {children}
    </CartProvider>
  );
}