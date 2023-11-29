import { useEffect, useState } from 'react';
import fs from 'fs';
import path from 'path';
import Nav from '@/components/Nav';
import Seo from '@/components/Seo';
import styles from '@/styles/sources.module.sass';
import styled from '@emotion/styled';
import { images } from '@/images';

const Main = styled.main({
  '&::before': {
    background: `url(${images.misc.code}) no-repeat 50% 50%/cover`,
  },
});

function OpenSources({ licenses }: { licenses: string[] }) {
  const [currentPage, setCurrentPage] = useState<string | null>(null);

  useEffect(() => {
    const storedPage = localStorage.getItem('currentPage');
    setCurrentPage(storedPage);
  }, []);

  const timestamp = Date.now();
  return (
    <Main className={styles.sources}>
      <Seo pageTitle="Open Sources" pageImg={`https://weabur.dev1stud.io/og-image.png?ts=${timestamp}`} />
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
