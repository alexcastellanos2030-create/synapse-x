import './globals.css';

export const metadata = {
  title: 'SYNAPSE-X OS',
  description: 'Sistema Operativo de Producción Panadera',
  viewport: 'width=1280, initial-scale=0.3, maximum-scale=3.0, user-scalable=yes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-[#0b0f19] text-slate-200 antialiased min-w-[1280px]">
        {children}
      </body>
    </html>
  );
}