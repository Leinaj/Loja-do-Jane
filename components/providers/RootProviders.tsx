// components/providers/RootProviders.tsx
'use client';

import React from 'react';
import { CartProvider } from './CartProvider';

export default function RootProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sem ToastBridge global — apenas o CartProvider
  return <CartProvider>{children}</CartProvider>;
}