'use client';

import React from 'react';
import { CartProvider } from '@/lib/cart';
import ToastBridge from '@/components/ui/toast'; // se seu toast está em outro caminho, ajuste

export default function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <ToastBridge />
    </CartProvider>
  );
}