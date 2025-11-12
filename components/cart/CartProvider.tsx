"use client";

import React from "react";
import { CartProvider as InternalCartProvider } from "./context";

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <InternalCartProvider>{children}</InternalCartProvider>;
}