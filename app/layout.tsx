// app/layout.tsx
import RootProviders from '@/components/providers/RootProviders';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}