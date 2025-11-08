// types/react-dom.d.ts
import * as React from 'react';

declare module 'react-dom' {
  // Declaração mínima para o createPortal usada pelo seu toast
  export function createPortal(
    children: React.ReactNode,
    container: Element | DocumentFragment,
    key?: null | string
  ): React.ReactPortal;
}