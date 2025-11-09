// components/providers/RootProviders.tsx
'use client';

import React from 'react';
import { CartProvider } from '@/lib/cart';
import { ToastProvider } from '@/components/ui/toast';

export default function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ToastProvider>{children}</ToastProvider>
    </CartProvider>
  );
}