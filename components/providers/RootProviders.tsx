'use client';

import React, { ReactNode } from 'react';
import CartProvider from './CartProvider';

export default function RootProviders({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}