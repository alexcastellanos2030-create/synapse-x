import './globals.css';
import './Synapse-X-Thema-Global.css';

export const metadata = {
  title: 'SYNAPSE-X OS',
  description: 'Sistema Operativo de Producción Panadera',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5.0,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      data-synapse-theme="oscuro"
      suppressHydrationWarning
      className="h-full dark"
    >
      <body className="antialiased w-full min-h-screen overflow-x-hidden flex flex-col">
        {children}
      </body>
    </html>
  );
}