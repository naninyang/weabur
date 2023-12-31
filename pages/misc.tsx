import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { ArrivalInfo, City, Station } from '@/types';
import { images } from '@/images';
import { fetchCityCodeList, fetchStationNoList, fetchArrivalInfoList } from '@/utils/misc';
import Seo from '@/components/Seo';
import Missing from '@/components/Missing';
import ArrivalTimer from '@/components/ArrivalTimer';
import WeatherMisc from '@/components/WeatherMisc';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { hex, mq, vw } from '@/styles/designSystem';
import styles from '@/styles/home.module.sass';

const DisabledIcon = styled.i({
  background: `url(${images.icons.disabled}) no-repeat 50% 50%/contain`,
});

const LocationIcon = styled.i({
  background: `url(${images.icons.location}) no-repeat 50% 50%/contain`,
});

const SearchIcon = styled.i({
  background: `url(${images.icons.search}) no-repeat 50% 50%/contain`,
});

const Select = styled.select({
  appearance: 'none',
  background: `${hex.black} url(${images.icons.select}) no-repeat 100% 50%/${vw(36, 430)} ${vw(36, 430)}`,
  [mq.minMedium]: {
    background: `${hex.black} url(${images.icons.select}) no-repeat 100% 50%/${vw(64, 1920)} ${vw(64, 1920)}`,
  },
});

export default function Home() {
  const [cityName, setCityName] = useState<string>('');
  const [cityList, setCityList] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [currentCity, setCurrentCity] = useState<string>('');
  const [stationName, setStationName] = useState<string>('');
  const [stationList, setStationList] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedStationName, setSelectedStationName] = useState<string | undefined>('');
  const [selectedStationNo, setSelectedStationNo] = useState<number | null>(null);
  const [arrivalInfo, setArrivalInfo] = useState<ArrivalInfo[]>([]);
  const [errorCitySearch, setErrorCitySearch] = useState<string>('');
  const [errorStationSearch, setErrorStationSearch] = useState<string>('');
  const [errorStationSelect, setErrorStationSelect] = useState<string>('');
  const [errorArrivalInfo, setErrorArrivalInfo] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCitySearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorCitySearch('');
    setArrivalInfo([]);
    setSelectedCity(null);
    setStationName('');
    setSelectedStationName('');
    if (cityName.length < 2) {
      setErrorCitySearch('도시명은 최소 2자 이상 입력해야 합니다.');
      return;
    }
    try {
      setIsLoading(true);
      const cities: City[] = await fetchCityCodeList();
      const filteredCities: City[] = cities.filter((city: City) => city.cityname.includes(cityName));
      if (filteredCities.length > 0) {
        setIsLoading(false);
        setCityList(filteredCities);
      } else {
        setErrorCitySearch('찾으려는 도시가 없습니다.');
        setIsLoading(false);
      }
    } catch (err) {
      setErrorCitySearch('국토교통부 TAGO 서버 오류입니다. 1분 뒤 시도하세요.');
    }
  };

  const handleCitySelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    setArrivalInfo([]);
    setSelectedStationName('');
    setCurrentCity('');
    setStationList([]);
    setSelectedCity(null);
    setSelectedStation(null);
    setStationName('');
    const cityCode = parseInt(event.target.value, 10);
    const selectedCity = cityList.find((city) => city.citycode);
    if (selectedCity) {
      setCurrentCity(selectedCity.cityname);
    }
    if (!isNaN(cityCode)) {
      setSelectedCity(cityCode);
      setStationList([]);
      setSelectedStation(null);
    }
  };

  const handleStationSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setArrivalInfo([]);
    setSelectedStationName('');
    setStationList([]);
    setSelectedStation(null);
    if (!selectedCity) {
      setErrorStationSelect('먼저 도시를 선택해주세요.');
      return;
    }
    if (stationName.length < 2) {
      setErrorStationSelect('정류소명은 최소 2자 이상 입력해야 합니다.');
      return;
    }
    try {
      setIsLoading(true);
      const stations = await fetchStationNoList(selectedCity, stationName);
      if (stations.length === 0) {
        setErrorStationSelect('찾으려는 정류소가 없습니다.');
        setStationList([]);
      } else {
        const stations: Station[] = await fetchStationNoList(selectedCity, stationName);
        setStationList(stations);
        setIsLoading(false);
      }
    } catch (err) {
      setErrorStationSelect('국토교통부 TAGO 서버 오류입니다. 1분 뒤 시도하세요.');
      setStationList([]);
      setIsLoading(false);
    }
  };

  const handleStationSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nodeid = event.target.value;
    const station = stationList.find((station) => station.nodeid === nodeid);
    setErrorStationSelect('');
    setSelectedStationName(station?.nodenm);
    setSelectedStationNo(station?.nodeno ?? null);
    setSelectedStation(station ?? null);
    setArrivalInfo([]);
    if (station) {
      await loadArrivalInfo(station);
    }
  };

  const loadArrivalInfo = async (station: Station) => {
    if (!station || !station.nodeid) {
      setErrorArrivalInfo('잘못된 접근입니다. 정류소명을 다시 검색하세요.');
      return;
    }
    try {
      const data = await fetchArrivalInfoList(selectedCity!, station.nodeid);
      setArrivalInfo(data);
    } catch (error) {
      console.error('Error loading arrival info:', error);
      setErrorArrivalInfo('국토교통부 TAGO 서버 오류입니다. 새로고침 하세요.');
    }
  };

  const busColors: { [key: string]: string } = {
    일반버스: '#90C73D',
    외곽버스: '#90C73D',
    농어촌버스: '#90C73D',
    마을버스: '#90C73D',
    광역버스: '#FB5852',
    직행버스: '#FB5852',
    좌석버스: '#7F49CA',
    간선버스: '#386DE8',
    지선버스: '#3CC344',
    공항버스: '#65A6D2',
    관광버스: '#F4B542',
  };

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

  useEffect(() => {
    localStorage.removeItem('currentPage');
    localStorage.setItem('currentPage', 'misc');
  }, []);

  const timestamp = Date.now();
  return (
    <main className={styles.weabur}>
      <Seo pageTitle="서비스 이용" pageImg={`https://weabur.dev1stud.io/og-image.png?ts=${timestamp}`} />
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
                <option value="misc">기타지역</option>
                <option value="seoul">서울특별시</option>
                <option value="daejeon">대전광역시</option>
              </Select>
              <form onSubmit={handleCitySearch}>
                <fieldset>
                  <legend>도시 검색폼</legend>
                  <div>
                    <input
                      type="search"
                      placeholder="도시 검색"
                      value={cityName}
                      onChange={(e) => setCityName(e.target.value)}
                    />
                  </div>
                  <button type="submit">
                    <span>검색하기</span>
                    <SearchIcon />
                  </button>
                </fieldset>
              </form>
            </div>
            {cityList.length > 0 && (
              <>
                <hr />
                <form>
                  <fieldset>
                    <legend>도시 선택폼</legend>
                    <div>
                      <Select onChange={handleCitySelect} value={selectedCity ?? ''}>
                        <option value="">도시 선택</option>
                        {cityList.map((city) => (
                          <option key={city.citycode} value={city.citycode}>
                            {city.cityname}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </fieldset>
                </form>
              </>
            )}
          </div>
          {selectedCity && (
            <>
              <hr />
              <div className={styles['form-group']}>
                <form onSubmit={handleStationSearch}>
                  <fieldset>
                    <legend>정류소 검색폼</legend>
                    <input
                      type="search"
                      placeholder="정류소 검색"
                      value={stationName}
                      onChange={(e) => setStationName(e.target.value)}
                    />
                    <button type="submit">
                      <span>검색하기</span>
                      <SearchIcon />
                    </button>
                  </fieldset>
                </form>
                {stationList.length > 0 && (
                  <>
                    <hr />
                    <form>
                      <fieldset>
                        <legend>정류소 선택폼</legend>
                        <Select onChange={handleStationSelect} value={selectedStation?.nodeid ?? ''}>
                          <option value="">정류소 선택</option>
                          {stationList.map((station) => (
                            <option key={station.nodeid} value={station.nodeid}>
                              {station.nodenm} {station.nodeno && `(${station.nodeno})`}
                            </option>
                          ))}
                        </Select>
                      </fieldset>
                    </form>
                  </>
                )}
              </div>
            </>
          )}
        </div>
        <Nav />
        {selectedStationName && (
          <div className={styles.header}>
            <h1>
              <s>
                <LocationIcon />
              </s>
              <span>
                <span aria-label="정류소 이름">{selectedStationName}</span>
                {selectedStationNo && <em aria-label="정류소 번호">{selectedStationNo}</em>}
              </span>
            </h1>
          </div>
        )}
        {/* {errorArrivalInfo && (
          <div className={styles.notice}>
            <div className={styles.warning}>
              <p>※ {errorArrivalInfo}</p>
            </div>
          </div>
        )} */}
        {cityList.length <= 0 && (
          <>
            {!isLoading && (
              <div className={styles.notice}>
                <p>도시를 먼저 검색해주세요</p>
                <div className={styles.warning}>
                  {errorCitySearch && <p>※ {errorCitySearch}</p>}
                  {errorStationSelect && <p>※ {errorStationSelect}</p>}
                  <p>※ 원주시는 횡성군 한정해서 서비스 중입니다.</p>
                  <p>※ 횡성군 이외의 원주시 지역은 서비스가 불가합니다.</p>
                </div>
              </div>
            )}
            {isLoading && (
              <p className={styles.loading}>
                <span>도시 목록 불러오는 중</span>
                <i />
              </p>
            )}
          </>
        )}
        {cityList.length > 0 && selectedCity === null && (
          <div className={styles.notice}>
            <p>도시를 선택해주세요</p>
            {(errorCitySearch || errorStationSelect) && (
              <div className={styles.warning}>
                {errorCitySearch && <p>※ {errorCitySearch}</p>}
                {errorStationSelect && <p>※ {errorStationSelect}</p>}
              </div>
            )}
          </div>
        )}
        {selectedCity && stationList.length <= 0 && (
          <>
            {!isLoading && (
              <div className={styles.notice}>
                <p>정류소를 검색해주세요</p>
                {(errorCitySearch || errorStationSelect) && (
                  <div className={styles.warning}>
                    {errorCitySearch && <p>※ {errorCitySearch}</p>}
                    {errorStationSelect && <p>※ {errorStationSelect}</p>}
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
        {selectedStationName == '' && selectedCity && stationList.length > 0 && arrivalInfo.length <= 0 && (
          <div className={styles.notice}>
            <p>정류소를 선택해주세요</p>
            {(errorCitySearch || errorStationSelect) && (
              <div className={styles.warning}>
                {errorCitySearch && <p>※ {errorCitySearch}</p>}
                {errorStationSelect && <p>※ {errorStationSelect}</p>}
              </div>
            )}
          </div>
        )}
        {/* {selectedStationName && !errorArrivalInfo && ( */}
        {selectedStationName && (
          <div className={styles.misc}>
            <div className={styles.mixed}>
              <div className={styles.schedule}>
                {arrivalInfo.length > 0 ? (
                  <div className={styles.item}>
                    {arrivalInfo.length > 1 ? (
                      <>
                        {arrivalInfo.slice(0, 2).map((info, index) => (
                          <div key={index} className={styles.nextup}>
                            <Missing ArrTime={info.arrtime} />
                            <div className={styles.routeno}>
                              <dl>
                                <dt>노선(버스)번호</dt>
                                <dd style={{ color: `${busColors[info.routetp]}` }}>{info.routeno}</dd>
                              </dl>
                            </div>
                            <div className={styles.info}>
                              <div className={styles.type}>
                                <div className={styles.route}>
                                  <dl>
                                    <dt>노션(버스)유형</dt>
                                    <dd style={{ color: busColors[info.routetp as keyof typeof busColors] }}>
                                      {info.routetp}
                                    </dd>
                                  </dl>
                                </div>
                                <div className={styles.vehicle}>
                                  <dl>
                                    <dt>차량유형(저상버스 유무)</dt>
                                    <dd>
                                      {info.vehicletp === '저상버스' ? <DisabledIcon /> : <i />}
                                      <span className={`${info.vehicletp === '일반차량' ? styles.vehicletp : ''}`}>
                                        {info.vehicletp}
                                      </span>
                                    </dd>
                                  </dl>
                                </div>
                              </div>
                              <div className={styles.time}>
                                <dl>
                                  <dt>도착 예정 시간</dt>
                                  <dd>
                                    <ArrivalTimer initialArrtime={info.arrtime} />
                                  </dd>
                                </dl>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <>
                        {arrivalInfo.slice(0, 2).map((info, index) => (
                          <div key={index} className={styles.nextup}>
                            <Missing ArrTime={info.arrtime} />
                            <div className={styles.routeno}>
                              <dl>
                                <dt>노선(버스)번호</dt>
                                <dd style={{ color: `${busColors[info.routetp]}` }}>{info.routeno}</dd>
                              </dl>
                            </div>
                            <div className={styles.info}>
                              <div className={styles.type}>
                                <div className={styles.route}>
                                  <dl>
                                    <dt>노션(버스)유형</dt>
                                    <dd style={{ color: busColors[info.routetp as keyof typeof busColors] }}>
                                      {info.routetp}
                                    </dd>
                                  </dl>
                                </div>
                                <div className={styles.vehicle}>
                                  <dl>
                                    <dt>차량유형(저상버스 유무)</dt>
                                    <dd>
                                      {info.vehicletp === '저상버스' ? <DisabledIcon /> : <i />}
                                      <span className={`${info.vehicletp === '일반차량' ? styles.vehicletp : ''}`}>
                                        {info.vehicletp}
                                      </span>
                                    </dd>
                                  </dl>
                                </div>
                              </div>
                              <div className={styles.time}>
                                <dl>
                                  <dt>도착 예정 시간</dt>
                                  <dd>
                                    <ArrivalTimer initialArrtime={info.arrtime} />
                                  </dd>
                                </dl>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className={styles.nextup}>
                          <p>다음 스케줄이 없습니다</p>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className={styles['no-item']}>
                    <div className={styles.nextup}>
                      <p>다음 스케줄이 없습니다</p>
                    </div>
                  </div>
                )}
              </div>
              <hr />
              <WeatherMisc currentCity={currentCity} />
            </div>
            <div className={styles.next}>
              {arrivalInfo.length > 2 && (
                <PerfectScrollbar className={styles['next-list']}>
                  <ul>
                    {arrivalInfo.slice(2).map((info, index) => (
                      <li key={index}>
                        <div className={styles.nextup}>
                          <Missing ArrTime={info.arrtime} />
                          <div className={styles.routeno}>
                            <dl>
                              <dt>노선(버스)번호</dt>
                              <dd style={{ color: `${busColors[info.routetp]}` }}>{info.routeno}</dd>
                            </dl>
                          </div>
                          <div className={styles.info}>
                            <div className={styles.type}>
                              <div className={styles.route}>
                                <dl>
                                  <dt>노션(버스)유형</dt>
                                  <dd style={{ color: `${busColors[info.routetp]}` }}>{info.routetp}</dd>
                                </dl>
                              </div>
                              <div className={styles.vehicle}>
                                <dl>
                                  <dt>차량유형(저상버스 유무)</dt>
                                  <dd>
                                    {info.vehicletp === '저상버스' ? <DisabledIcon /> : <i />}
                                    <span className={`${info.vehicletp === '일반차량' ? styles.vehicletp : ''}`}>
                                      {info.vehicletp}
                                    </span>
                                  </dd>
                                </dl>
                              </div>
                            </div>
                            <div className={styles.time}>
                              <dl>
                                <dt>도착 예정 시간</dt>
                                <dd>
                                  <ArrivalTimer initialArrtime={info.arrtime} />
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                    <li>
                      <div className={styles.nextup}>
                        <p>다음 스케줄이 없습니다</p>
                      </div>
                    </li>
                  </ul>
                </PerfectScrollbar>
              )}
              <div className={styles.dummy} />
            </div>
          </div>
        )}
        <Footer />
      </div>
    </main>
  );
}
