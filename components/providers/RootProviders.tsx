'use client';

import React from 'react';
import { CartProvider } from '../providers/CartProvider';
// Se tiver um ToastBridge, importe aqui. Senão, pode remover a linha abaixo.
// import ToastBridge from '../ui/ToastBridge';

export default function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {/* <ToastBridge /> */}
      {children}
    </CartProvider>
  );
}