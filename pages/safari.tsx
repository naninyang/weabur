import styled from '@emotion/styled';
import { images } from '@/images';
import Seo from '@/components/Seo';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { mq, rem } from '@/styles/designSystem';
import styles from '@/styles/safari.module.sass';

const Main = styled.main({
  '& .dummy': {
    background: `url(${images.misc.mobile}) no-repeat 50% 50%/cover`,
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

export default function Safari() {
  const timestamp = Date.now();
  return (
    <Main className={styles.safari}>
      <Seo pageTitle="사파리에서 앱 내려받기" pageImg={`https://weabur.dev1stud.io/og-image.png?ts=${timestamp}`} />
      <div className="dummy">
        <div />
      </div>
      <div className={styles.wrapper}>
        <Nav />
        <div className={styles.container}>
          <section>
            <h1>
              <em>
                <span className={styles.yellow}>iOS</span>와 <span className={styles.aqua}>iPadOS</span>에서
              </em>
              <em>내려받기</em>
            </h1>
            <div className={styles.content}>
              <p>모바일 사파리 하단의 공유 버튼을 tap 합니다.</p>
              <p>홈 화면에 추가 버튼을 tap 합니다.</p>
              <p>추가 버튼을 tap 합니다.</p>
              <p>
                추가 버튼을 tap 하면 자동으로 바탕화면으로 빠져 나옵니다.{' '}
                <em>여기에서 웨버 아이콘을 tap 하면 됩니다.</em>
              </p>
            </div>
          </section>
          <section>
            <h1>
              <em>
                <span className={styles.fuchsia}>macOS Safari</span>에서
              </em>
              <em>내려받기</em>
            </h1>
            <div className={styles.content}>
              <p>Safari 파일 메뉴에 있는 Dock에 추가 메뉴를 선택합니다.</p>
              <p>Dock에 추가 창에서 하단에 있는 추가 버튼을 선택합니다.</p>
              <p>
                Dock에 웨버 아이콘이 추가된 것을 확인한 후, <em>웨버 아이콘을 클릭하세요.</em>
              </p>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </Main>
  );
}
