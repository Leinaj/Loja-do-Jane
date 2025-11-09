'use client';

import React from 'react';

type State = { hasError: boolean; error?: any };

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(err: any) {
    // loga no console para inspeção no DevTools
    console.error('Erro capturado pelo ErrorBoundary:', err);
  }

  render() {
    if (this.state.hasError) {
      const msg =
        (this.state.error && (this.state.error.message || String(this.state.error))) ||
        'Erro desconhecido';

      const stack =
        (this.state.error && (this.state.error.stack || '')) || '';

      return (
        <div className="mx-auto max-w-2xl p-6 text-center">
          <h2 className="text-2xl font-semibold mb-2">Ops! Algo deu errado.</h2>
          <p className="opacity-80 mb-4">Tente recarregar a página.</p>

          {/* Info extra para debug (útil em produção se estiver no celular) */}
          <details className="mx-auto w-full rounded-lg bg-black/20 p-4 text-left">
            <summary>Detalhes técnicos (debug)</summary>
            <pre className="mt-3 whitespace-pre-wrap text-sm leading-5">
{msg}
{stack ? `\n\n${stack}` : ''}
            </pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}