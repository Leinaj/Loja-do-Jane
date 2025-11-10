'use client';

import { ReactNode } from 'react';
import { CartProvider } from '@/components/cart/context';
// Se o alias @ não existir no seu tsconfig.json, troque a linha acima por:
// import { CartProvider } from '../components/cart/context';

export default function CartProviderClient({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}