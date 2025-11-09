// app/cart-provider.tsx
'use client';

import { ReactNode } from 'react';
import { CartProvider } from '@/components/cart/context'; // 👈 ajuste o caminho se seu context estiver em outro lugar

type Props = { children: ReactNode };

export default function CartProviderClient({ children }: Props) {
  return <CartProvider>{children}</CartProvider>;
}