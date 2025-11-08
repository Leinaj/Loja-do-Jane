'use client';

import { CartProvider } from '@/lib/cart';
import { ToastProvider, ToastBridge } from '@/components/ui/toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ToastProvider>
        {/* Conecta o helper global toast() ao provider */}
        <ToastBridge />
        {children}
      </ToastProvider>
    </CartProvider>
  );
}