import fs from 'fs';
import path from 'path';
import styled from '@emotion/styled';
import Nav from '@/components/Nav';
import Seo from '@/components/Seo';
import styles from '@/styles/sources.module.sass';
import { images } from '@/images';
import Footer from '@/components/Footer';

const Main = styled.main({
  '& .dummy': {
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    width: '100%',
    height: '100%',
    background: `url(${images.misc.code}) no-repeat 50% 50%/cover`,
    '& div': {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, .75)',
    },
  },
});

function OpenSources({ licenses }: { licenses: string[] }) {
  const timestamp = Date.now();
  return (
    <Main className={styles.sources}>
      <Seo pageTitle="Open Sources" pageImg={`https://weabur.dev1stud.io/og-image.png?ts=${timestamp}`} />
      <div className="dummy">
        <div />
      </div>
      <div className={styles.wrapper}>
        <Nav />
        <div className={styles.container}>
          <h1>
            <em>
              <span className={styles.yellow}>Open</span> <span className={styles.aqua}>Sources</span>
            </em>
          </h1>
          <dl>
            <div>
              <dt>기획</dt>
              <dd>클로이 Chloe</dd>
            </div>
            <div>
              <dt>UX 디자인</dt>
              <dd>클로이 Chloe</dd>
            </div>
            <div>
              <dt>프론트엔드 개발</dt>
              <dd>클로이 Chloe</dd>
            </div>
          </dl>
          <div className={styles.list}>
            <hr />
            {licenses.map((license, index) => (
              <section key={index}>
                <pre>
                  <code>{license}</code>
                </pre>
                <hr />
              </section>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </Main>
  );
}

export async function getStaticProps() {
  const markdownDir = path.join(process.cwd(), 'pages/licenses');
  const filenames = fs.readdirSync(markdownDir);
  const licenses = filenames.map((filename) => {
    const filePath = path.join(markdownDir, filename);
    return fs.readFileSync(filePath, 'utf8');
  });

  return {
    props: {
      licenses,
    },
  };
}

export default OpenSources;
