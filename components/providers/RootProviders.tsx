'use client';

import { CartProvider } from '@/lib/cart';
import { ToastProvider, ToastBridge } from '@/components/ui/toast';

export default function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ToastProvider>
        {/* Faz o bridge do helper global toast() */}
        <ToastBridge />
        {children}
      </ToastProvider>
    </CartProvider>
  );
}