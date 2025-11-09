'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Mostra erro real em produção para conseguirmos debugar
  return (
    <html>
      <body
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#0f1a17',
          color: '#e6fff3',
          padding: 24,
          fontFamily: 'ui-sans-serif, system-ui, Arial',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 720 }}>
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>Ops! Algo deu errado.</h1>
          <p style={{ opacity: 0.9, marginBottom: 16 }}>
            {error?.message || 'Erro desconhecido'}
          </p>
          {error?.stack && (
            <pre
              style={{
                textAlign: 'left',
                whiteSpace: 'pre-wrap',
                background: '#0a1412',
                border: '1px solid #1f3a33',
                borderRadius: 12,
                padding: 12,
                fontSize: 12,
                overflow: 'auto',
              }}
            >
              {error.stack}
            </pre>
          )}
          <button
            onClick={() => reset()}
            style={{
              marginTop: 16,
              padding: '10px 16px',
              borderRadius: 10,
              background: '#16a34a',
              color: '#fff',
              border: 'none',
              fontWeight: 600,
            }}
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}