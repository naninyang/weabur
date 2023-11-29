import '@/styles/globals.sass';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import 'pretendard/dist/web/static/Pretendard-Black.css';
import 'pretendard/dist/web/static/Pretendard-Light.css';
import 'pretendard/dist/web/static/Pretendard-Medium.css';
import 'pretendard/dist/web/static/Pretendard-Regular.css';
import localFont from 'next/font/local';
const DungGeunMo = localFont({ src: '../fonts/DungGeunMo.woff2' });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no" />
      </Head>
      <style jsx global>
        {`
          .dgm,
          body,
          pre,
          input,
          button,
          textarea,
          select {
            font-family: ${DungGeunMo.style.fontFamily}, monospace;
          }
        `}
      </style>
      <Component {...pageProps} />
    </>
  );
}
