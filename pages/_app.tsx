import '@/styles/globals.sass';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import localFont from 'next/font/local';
const DungGeunMo = localFont({ src: '../fonts/DungGeunMo.woff2' });
const DungGeunMoFallback = localFont({ src: '../fonts/DungGeunMo.woff' });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>웨버 WeaBur</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="description" content="대중교통과 날씨정보를 알려드려요" />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:url" content="https://waebur.dev1stud.io" />
        <meta property="og:title" content="웨버 WeaBur" />
        <meta property="og:site_name" content="웨버 WeaBur" />
        <meta property="og:description" content="대중교통과 날씨정보를 알려드려요" />
        <meta property="og:type" content="site" />
        <meta property="og:image" content="https://weabur.dev1stud.io/og.png" />
        <link rel="canonical" href="https://weabur.dev1stud.io" />
        <link rel="alternate" href="https://weabur.dev1stud.io" hrefLang="ko-KR" />
      </Head>
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
