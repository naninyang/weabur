import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { StationInfo, BusArrivalInfo } from '@/types';
import { images } from '@/images';
import { fetchStationByName, fetchBusArrivals } from '@/utils/seoul';
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
  const [stationName, setStationName] = useState<string>('');
  const [stationInfo, setStationInfo] = useState<StationInfo[]>([]);
  const [busArrivals, setBusArrivals] = useState<BusArrivalInfo[]>([]);
  const [errorStation, setErrorStation] = useState<string>('');
  const [selectedArsId, setSelectedArsId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleStationSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorStation('');
    setBusArrivals([]);
    setStationInfo([]);
    if (stationName.length < 2) {
      setErrorStation('정류소명은 최소 2자 이상 입력해야 합니다.');
      setIsLoading(false);
      return;
    }
    try {
      const stations = await fetchStationByName(stationName);
      if (stations === undefined) {
        setErrorStation('검색된 정류소가 없습니다.');
      } else {
        setStationInfo(stations);
      }
    } catch (error) {
      setErrorStation('서울 버스정보시스템 서버 오류 입니다. 다시 시도하세요');
    }
  };

  const selectedStationLatitude = selectedArsId
    ? stationInfo.find((station) => station.arsId === selectedArsId)?.tmY
    : null;
  const selectedStationLongitude = selectedArsId
    ? stationInfo.find((station) => station.arsId === selectedArsId)?.tmX
    : null;

  const selectedStationName = selectedArsId
    ? stationInfo.find((station) => station.arsId === selectedArsId)?.stNm
    : null;

  const handleBusArrivalSearch = async (arsId: string) => {
    setSelectedArsId(arsId);
    setIsLoading(true);
    try {
      const arrivals = await fetchBusArrivals(arsId);
      setBusArrivals(arrivals);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching bus arrivals:', error);
    }
  };

  const formatTime = (timeStr: string) => {
    const trimmed = timeStr.trim();
    return `${trimmed.slice(0, 2)}:${trimmed.slice(2)}`;
  };

  const busColors: { [key: string]: string } = {
    1: '#65A6D2',
    2: '#90C73D',
    3: '#386DE8',
    4: '#3CC344',
    5: '#F4B542',
    6: '#FB5852',
    7: '#FB5852',
    8: '#FB5852',
    9: '#7F49CA',
    0: '#7F49CA',
  };

  const busTypes: { [key: string]: string } = {
    1: '공항버스',
    2: '마을버스',
    3: '간선버스',
    4: '지선버스',
    5: '순환버스',
    6: '광역버스',
    7: '인천버스',
    8: '경기버스',
    9: '폐지버스',
    0: '공용버스',
  };

  useEffect(() => {
    localStorage.removeItem('currentPage');
    localStorage.setItem('currentPage', 'seoul');
  }, []);

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
                <option value="seoul">서울특별시</option>
                <option value="daejeon">대전광역시</option>
                <option value="misc">기타지역</option>
              </Select>
              <form onSubmit={handleStationSearch}>
                <fieldset>
                  <legend>정류소명 검색폼</legend>
                  <div>
                    <input
                      type="text"
                      placeholder="정류소명 검색"
                      value={stationName}
                      onChange={(e) => setStationName(e.target.value)}
                    />
                  </div>
                  <button type="submit">
                    <span>검색하기</span>
                    <SearchIcon />
                  </button>
                </fieldset>
              </form>
            </div>
            {stationInfo.length > 0 && (
              <>
                <hr />
                <form>
                  <fieldset>
                    <legend>정류소 선택</legend>
                    <div>
                      <Select onChange={(e) => handleBusArrivalSearch(e.target.value)}>
                        <option value="">정류소 선택</option>
                        {stationInfo.map((station) => (
                          <option key={station.arsId} value={station.arsId}>
                            {station.stNm} ({station.arsId})
                          </option>
                        ))}
                      </Select>
                    </div>
                  </fieldset>
                </form>
              </>
            )}
          </div>
        </div>
        <Nav />
        {busArrivals.length === 0 && stationInfo.length === 0 && (
          <>
            {!isLoading && (
              <div className={styles.notice}>
                <p>정류소를 검색해주세요</p>
                {errorStation && (
                  <div className={styles.warning}>
                    <p>{errorStation}</p>
                  </div>
                )}
              </div>
            )}
            {isLoading && (
              <p className={styles.loading}>
                <span>정류소 목록 불러오는 중</span>
                <i />
              </p>
            )}
          </>
        )}
        {stationInfo.length > 0 && busArrivals.length === 0 && (
          <>
            {!isLoading && (
              <div className={styles.notice}>
                <p>정류소를 선택해주세요</p>
              </div>
            )}
            {isLoading && (
              <p className={styles.loading}>
                <span>정류소 목록 불러오는 중</span>
                <i />
              </p>
            )}
          </>
        )}
        {busArrivals.length > 0 && (
          <>
            {selectedStationName && (
              <div className={styles.header}>
                <h1>
                  <s>
                    <LocationIcon />
                  </s>
                  <span>
                    <span aria-label="정류소 이름">{selectedStationName}</span>
                    {selectedArsId && <em aria-label="정류소 번호">{selectedArsId}</em>}
                  </span>
                </h1>
              </div>
            )}
            {!isLoading && (
              <div className={styles.seoul}>
                {selectedStationLatitude && selectedStationLongitude && (
                  <WeatherSeoul latitude={selectedStationLatitude} longitude={selectedStationLongitude} />
                )}
                {busArrivals.map((info, index) => (
                  <div key={index} className={styles.nextup}>
                    <div className={styles.summary}>
                      <div className={styles.routeno}>
                        <dl>
                          <dt>노선(버스)번호</dt>
                          <dd style={{ color: `${busColors[info.routeType]}` }}>{info.busRouteAbrv}</dd>
                        </dl>
                      </div>
                      <div className={styles.info}>
                        <div className={styles.router}>
                          <div className={styles.route}>
                            <dl>
                              <dt>노션(버스)유형</dt>
                              <dd style={{ color: `${busColors[info.routeType]}` }}>{busTypes[info.routeType]}</dd>
                            </dl>
                          </div>
                          <div className={styles.term}>
                            <div>
                              <dl>
                                <dt>구간</dt>
                                <dd>{info.sectNm} 구간</dd>
                              </dl>
                            </div>
                            <div>
                              <dl>
                                <dt>다음정류장순번</dt>
                                <dd>{info.nxtStn}</dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                        <div className={styles.timing}>
                          <div>
                            <dl>
                              <dt>첫차</dt>
                              <dd>{formatTime(info.firstTm)}</dd>
                            </dl>
                          </div>
                          <div>
                            <dl>
                              <dt>막차</dt>
                              <dd>{formatTime(info.lastTm)}</dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.schedule}>
                      <div className={styles.item}>
                        <div className={styles.vehicle}>
                          <dl>
                            <dt>차량유형(저상버스 유무)</dt>
                            <dd>
                              <span className={`${info.busType1 === '0' ? '' : styles.vehicletp}`}>
                                {info.busType1 === '0' ? '일반버스' : '저상버스'}
                              </span>
                              {info.busType1 === '0' ? <i /> : <DisabledIcon />}
                            </dd>
                          </dl>
                        </div>
                        <div className={styles.time}>
                          <dl>
                            <dt>도착 예정 시간</dt>
                            <dd>{info.arrmsg1}</dd>
                          </dl>
                        </div>
                      </div>
                      <div className={styles.item}>
                        <div className={styles.vehicle}>
                          <dl>
                            <dt>차량유형(저상버스 유무)</dt>
                            <dd>
                              <span className={`${info.busType2 === '0' ? '' : styles.vehicletp}`}>
                                {info.busType2 === '0' ? '일반버스' : '저상버스'}
                              </span>
                              {info.busType2 === '0' ? <i /> : <DisabledIcon />}
                            </dd>
                          </dl>
                        </div>
                        <div className={styles.time}>
                          <dl>
                            <dt>도착 예정 시간</dt>
                            <dd>{info.arrmsg2}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {isLoading && (
              <p className={styles.loading}>
                <span>정류소 목록 불러오는 중</span>
                <i />
              </p>
            )}
          </>
        )}
        <Footer />
      </div>
    </main>
  );
}
