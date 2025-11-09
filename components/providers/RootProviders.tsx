'use client';

import React from 'react';
import { ToastProvider } from '@/components/ui/toast';

export default function RootProviders({ children }: { children: React.ReactNode }) {
  // Aqui você pode colocar outros providers (Theme, Query, etc.) no futuro.
  return <ToastProvider>{children}</ToastProvider>;
}