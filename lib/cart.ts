'use client';

import { useState, useEffect } from 'react';

export function useCart() {
  const [items, setItems] = useState<any[]>([]);

  // Carrega o carrinho salvo no localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cart');
      if (stored) setItems(JSON.parse(stored));
    }
  }, []);

  // Atualiza o localStorage quando o carrinho muda
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items]);

  // Remove um item pelo id
  function remove(id: string) {
    setItems(prev => prev.filter(it => it.id !== id));
  }

  // Limpa o carrinho inteiro
  function clear() {
    setItems([]);
  }

  return { items, setItems, remove, clear };
}