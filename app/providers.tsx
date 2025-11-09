'use client';

import React from 'react';
import { CartProvider } from '@/components/providers/CartProvider';
import { ToastProvider } from '@/components/ui/toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <CartProvider>{children}</CartProvider>
    </ToastProvider>
  );
}