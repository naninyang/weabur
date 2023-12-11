import { useState } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { ArrivalInfo, City, Station } from '@/types';
import { images } from '@/images';
import { fetchCityCodeList, fetchStationNoList, fetchArrivalInfoList } from '@/utils/api';
import Seo from '@/components/Seo';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { hex, mq, vw } from '@/styles/designSystem';
import styles from '@/styles/home.module.sass';

const Select = styled.select({
  appearance: 'none',
  background: `${hex.black} url(${images.icons.select}) no-repeat 100% 50%/${vw(36, 430)} ${vw(36, 430)}`,
  [mq.minMedium]: {
    background: `${hex.black} url(${images.icons.select}) no-repeat 100% 50%/${vw(64, 1920)} ${vw(64, 1920)}`,
  },
});

export default function Home() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState('');
  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocation = event.target.value;
    setSelectedLocation(newLocation);

    if (newLocation) {
      switch (newLocation) {
        case 'seoul':
          router.push('/seoul');
          break;
        case 'daejeon':
          router.push('/daejeon');
          break;
        case 'wonju':
          router.push('/wonju');
          break;
        case 'misc':
          router.push('/misc');
          break;
        default:
          break;
      }
    }
  };

  const timestamp = Date.now();
  return (
    <main className={styles.weabur}>
      <Seo pageTitle="서비스 이용" pageImg={`https://weabur.dev1stud.io/og-image.png?ts=${timestamp}`} />
      <div className={styles.container}>
        <div className={styles.search}>
          <div className={styles['form-group']}>
            <form>
              <fieldset>
                <legend>선택하면 해당 지역으로 자동으로 이동합니다</legend>
                <Select className={styles.select} value={selectedLocation} onChange={handleLocationChange}>
                  <option value="">지역 선택</option>
                  <option value="misc">기타지역</option>
                  <option value="seoul">서울특별시</option>
                  <option value="daejeon">대전광역시</option>
                  <option value="wonju">원주시</option>
                </Select>
              </fieldset>
            </form>
          </div>
        </div>
        <Nav />
        <div className={styles.notice}>
          <p>지역을 먼저 검색해주세요</p>
        </div>
        <Footer />
      </div>
    </main>
  );
}
