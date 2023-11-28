import '@/styles/globals.sass';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import localFont from 'next/font/local';
const DungGeunMo = localFont({ src: '../fonts/DungGeunMo.woff2' });
const DungGeunMoFallback = localFont({ src: '../fonts/DungGeunMo.woff' });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>
        {`
          body,
          pre,
          input,
          button,
          textarea,
          select {
            font-family: ${DungGeunMo.style.fontFamily}, ${DungGeunMoFallback.style.fontFamily}, monospace;
          }
        `}
      </style>
      <Component {...pageProps} />
    </>
  );
}
