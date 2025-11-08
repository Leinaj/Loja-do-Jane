'use client';

import { CartProvider } from '@/lib/cart';
import { ToastProvider, ToastBridge } from '@/components/ui/toast';

export default function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ToastProvider>
        <ToastBridge />
        {children}
      </ToastProvider>
    </CartProvider>
  );
}