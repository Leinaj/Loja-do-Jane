'use client';

import { CartProvider } from '../components/cart/context';

export default function CartProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CartProvider>{children}</CartProvider>;
}