'use client';

import { ReactNode } from 'react';
import { CartProvider } from '../lib/cart';
import { ToastContainer } from '../components/ui/toast';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      {/* Container global para toasts */}
      <ToastContainer />
    </CartProvider>
  );
}