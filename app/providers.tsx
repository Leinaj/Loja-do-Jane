'use client';

import React from 'react';
import { CartProvider } from '@/components/providers/CartProvider';
import { ToastProvider, ToastBridge } from '@/components/ui/toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ToastProvider>
        <ToastBridge />
        {children}
      </ToastProvider>
    </CartProvider>
  );
}