'use client';

import React from 'react';
import { CartProvider } from '@/lib/cart';

export default function RootProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CartProvider>{children}</CartProvider>;
}