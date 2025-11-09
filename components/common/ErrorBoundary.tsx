'use client';

import React from 'react';

type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err: any) {
    // Apenas log – evita tela preta
    console.error('Erro capturado pelo ErrorBoundary:', err);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center">
          <h2 className="text-lg font-semibold">Ops! Algo deu errado.</h2>
          <p className="opacity-70">Tente recarregar a página.</p>
        </div>
      );
    }
    return this.props.children;
  }
}