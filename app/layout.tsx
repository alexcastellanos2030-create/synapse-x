import './globals.css';

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
    <html lang="es" className="h-full">
      <body className="bg-[#0b0f19] text-slate-200 antialiased w-full min-h-screen overflow-x-hidden flex flex-col">
        {children}
      </body>
    </html>
  );
}