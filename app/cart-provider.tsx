'use client';

import { ReactNode } from 'react';
// ajuste o caminho conforme a sua pasta real de components
import { CartProvider } from '../components/cart/context';

export default function CartProviderClient({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}