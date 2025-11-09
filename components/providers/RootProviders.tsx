'use client';

import React from 'react';
import { ToastProvider, ToastBridge } from '@/components/ui/toast';

export default function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {/* Compatibilidade com projetos que esperam esse componente */}
      <ToastBridge />
      {children}
    </ToastProvider>
  );
}