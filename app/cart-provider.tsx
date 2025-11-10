'use client';

import { ReactNode } from 'react';
import { CartProvider } from '../components/cart/context';

export default function CartProviderClient({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}