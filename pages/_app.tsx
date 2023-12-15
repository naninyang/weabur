import { useEffect } from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import 'pretendard/dist/web/static/Pretendard-Black.css';
import 'pretendard/dist/web/static/Pretendard-Light.css';
import 'pretendard/dist/web/static/Pretendard-Medium.css';
import 'pretendard/dist/web/static/Pretendard-Regular.css';
import localFont from 'next/font/local';
import { GA_TRACKING_ID, pageview } from './gtag';
import '@/styles/globals.sass';

const DungGeunMo = localFont({ src: '../fonts/DungGeunMo.woff2' });

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const registInit = async () => {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        registration.waiting?.postMessage('SKIP_WAITING');
      };
      registInit();
    }
  }, []);

  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: any) => {
      pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no" />
      </Head>
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
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
