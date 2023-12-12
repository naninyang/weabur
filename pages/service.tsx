import { useEffect, useState } from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';
import { isSafari, isFirefox } from 'react-device-detect';
import { images } from '@/images';
import Seo from '@/components/Seo';
import Anchor from '@/components/Anchor';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { mq, rem } from '@/styles/designSystem';
import styles from '@/styles/service.module.sass';

const Main = styled.main({
  '& .dummy': {
    background: `url(${images.misc.service}) no-repeat 50% 50%/cover`,
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    width: '100%',
    height: '100%',
    [mq.minMedium]: {
      height: `calc(100% - ${rem(16)})`,
    },
    '& div': {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, .75)',
    },
  },
});

const Pwa = styled.i({
  background: `url(${images.misc.pwa}) no-repeat 50% 50%/contain`,
});

const Safari = styled.i({
  background: `url(${images.misc.safari}) no-repeat 50% 50%/contain`,
});

export default function Service() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [deviceSafari, setDeviceSafari] = useState<string>();
  const [deviceisFirefox, setDeviceisFirefox] = useState<string>();

  const onInstallPWA = () => {
    if (deferredPrompt) {
      const promptEvent = deferredPrompt as any;
      promptEvent.prompt();
      promptEvent.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  useEffect(() => {
    if (isSafari) {
      setDeviceSafari('isSafari');
    }
    if (isFirefox) {
      setDeviceisFirefox('isFirefox');
    }
  }, []);

  const timestamp = Date.now();
  return (
    <Main className={styles.service}>
      <Seo pageTitle="서비스 소개" pageImg={`https://weabur.dev1stud.io/og-image.png?ts=${timestamp}`} />
      <div className="dummy">
        <div />
      </div>
      <div className={styles.wrapper}>
        <Nav />
        <div className={styles.container}>
          <section>
            <h1>
              <em>
                <span className={styles.yellow}>날씨정보</span>와{' '}
              </em>
              <em>
                <span className={styles.aqua}>버스도착정보</span>를 한눈에
              </em>
            </h1>
            <div className={styles.content}>
              <p>
                버스 정류소의 버스도착정보 LED 느낌의 글꼴과 <em>디자인 UX로 날씨정보 및 버스도착정보를 보여드려요!</em>
              </p>
              <p>날씨정보는 검색한 도시의 관청 위치 기준으로 가져옵니다</p>
              <p>이를테면 부산을 선택하면 부산시청 위치의 날씨정보를 가져오는 식입니다.</p>
            </div>
            {/* <div className={styles.image}>
            <Image src="/app.webp" width="370" height="800" alt="" />
          </div> */}
          </section>
          <section>
            <h1>
              <em>
                <span className={styles.yellow}>아이폰, 아이패드</span> 그리고{' '}
              </em>
              <em>
                <span className={styles.aqua}>안드로이드</span>, PC 운영체제 모두 지원
              </em>
            </h1>
            <div className={styles.content}>
              <p>
                아이폰, 아이패드, 안드로이드 등 스마트 디바이스 뿐만 아니라{' '}
                <em>macOS, 윈도우즈, 리눅스 등 PC 운영체제를 지원합니다.</em>
              </p>
              <p>
                최신의 PC, 모바일 모던 웹브라우저에서 이용하실 수 있고{' '}
                <em>구글의 크롬 및 애플 사파리(모바일 포함)에서 앱을 내려받을 수 있어요.</em>
              </p>
              <div className={styles.link}>
                {deviceSafari === 'isSafari' ? (
                  <Anchor href="/safari" className={styles.pwa}>
                    <span>Safari 앱 내려받기</span>
                    <Safari />
                  </Anchor>
                ) : deviceisFirefox === 'isFirefox' ? (
                  <p className="dgm">
                    Firefox에서는 내려받을 수 없습니다. <em>Chrome 또는 Safari를 이용해 주세요</em>
                  </p>
                ) : (
                  <button type="button" onClick={onInstallPWA} className={styles.pwa}>
                    <span>앱 내려받기</span>
                    <Pwa />
                  </button>
                )}
              </div>
            </div>
          </section>
          <section>
            <h1>
              <em>원주시 웨버 서비스는</em>{' '}
              <em>
                <span className={styles.fuchsia}>지원되지 않습니다</span>
              </em>
            </h1>
            <div className={styles.content}>
              <p>기타 지역 웨버 서비스는 국토교통부 TAGO 서비스의 데이터 이용합니다.</p>
              <p>
                서울특별시 웨버 서비스는 정류소정보조회서비스 데이터를 이용하며,{' '}
                <em>대전광역시 웨버 서비스는 대전광역시 버스정보시스템의 데이터를 이용합니다.</em>
              </p>
              <p>
                원주시는 횡성군 한정해서 서비스 중입니다. <em>횡성군 이외의 원주시는 지원할 예정이 없습니다.</em>
              </p>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </Main>
  );
}
