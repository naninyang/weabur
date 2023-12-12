import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { images } from '@/images';
import Nav from '@/components/Nav';
import WeatherSeoul from '@/components/WeatherSeoul';
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

const LocationIcon = styled.i({
  background: `url(${images.icons.location}) no-repeat 50% 50%/contain`,
});

const SearchIcon = styled.i({
  background: `url(${images.icons.search}) no-repeat 50% 50%/contain`,
});

const DisabledIcon = styled.i({
  background: `url(${images.icons.disabled}) no-repeat 50% 50%/contain`,
});

export default function Seoul() {
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

  return (
    <main className={styles.weabur}>
      <div className={styles.container}>
        <div className={styles.search}>
          <div className={styles['form-group']}>
            <div className={styles['area-option']}>
              <Select
                className={styles.select}
                value={selectedLocation}
                onChange={handleLocationChange}
                title="선택하면 해당 지역으로 자동으로 이동합니다"
              >
                <option value="daejeon">대전광역시</option>
                <option value="seoul">서울특별시</option>
                <option value="misc">기타지역</option>
              </Select>
            </div>
          </div>
        </div>
        <Nav />
        <div className={styles.notice}>
          {/* <p>정류소를 선택해주세요</p> */}
          <div className={styles.warning}>
            <p>※ 준비 중입니다.</p>
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}
