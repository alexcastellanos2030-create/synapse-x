import type { AppProps } from 'next/app';
import { PreviewProvider } from '../context/PreviewContext';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PreviewProvider>
      <Component {...pageProps} />
    </PreviewProvider>
  );
}