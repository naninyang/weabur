import { useEffect, useState } from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { images } from '@/images';
import { fetchCityCodeList, fetchStationNoList, fetchArrivalInfoList } from '@/utils/api';
import { rem } from '@/styles/designSystem';
import styles from '@/styles/home.module.sass';

const DisabledIcon = styled.i({
  background: `url(${images.icons.disabled}) no-repeat 50% 50%/contain`,
});

const DustIcon = styled.i({
  background: `url(${images.icons.dust}) no-repeat 50% 50%/contain`,
});

const LocationIcon = styled.i({
  background: `url(${images.icons.location}) no-repeat 50% 50%/contain`,
});

const SearchIcon = styled.i({
  background: `url(${images.icons.search}) no-repeat 50% 50%/contain`,
});

const Select = styled.select({
  background: `url(${images.icons.select}) no-repeat 100% 50%/${rem(64)} ${rem(64)}`,
});

const TempIcon = styled.i({
  background: `url(${images.icons.temp}) no-repeat 50% 50%/contain`,
});

export default function Home() {
  const [cityName, setCityName] = useState('');
  const [cityList, setCityList] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [stationName, setStationName] = useState('');
  const [stationList, setStationList] = useState([]);
  const [selectedStation, setSelectedStation] = useState('');
  const [selectedStationName, setSelectedStationName] = useState('');
  const [selectedStationNo, setSelectedStationNo] = useState('');
  const [arrivalInfo, setArrivalInfo] = useState([]);
  const [errorCitySearch, setErrorCitySearch] = useState('');
  const [errorStationSearch, setErrorStationSearch] = useState('');
  const [errorStationSelect, setErrorStationSelect] = useState('');
  const [errorArrivalInfo, setErrorArrivalInfo] = useState('');
  const [error, setError] = useState('');

  const handleCitySearch = async (e) => {
    e.preventDefault();
    setErrorCitySearch('');
    if (cityName.length < 2) {
      setErrorCitySearch('도시명은 최소 2자 이상 입력해야 합니다.');
      return;
    }
    try {
      const cities = await fetchCityCodeList();
      const filteredCities = cities.filter((city) => city.cityname.includes(cityName));
      if (filteredCities.length > 0) {
        setCityList(filteredCities);
      } else {
        setErrorCitySearch('찾으려는 도시가 없습니다.');
      }
    } catch (err) {
      setErrorCitySearch('국토교통부 TAGO 서버 오류입니다. 1분 뒤 시도하세요.');
    }
  };

  const handleCitySelect = async (e) => {
    const code = e.target.value;
    setSelectedCity(code);
    setStationList([]);
    setSelectedStation('');
  };

  const handleStationSearch = async (e) => {
    e.preventDefault();
    setErrorStationSearch('');
    if (!selectedCity) {
      setErrorStationSearch('먼저 도시를 선택해주세요.');
      return;
    }
    try {
      const stations = await fetchStationNoList(selectedCity, stationName);
      console.log('stationName: ', stationName);
      if (stations.length === 0) {
        setErrorStationSearch('찾으려는 정류소가 없습니다.');
        setStationList([]);
      } else {
        setStationList(stations);
      }
    } catch (err) {
      setErrorStationSearch('국토교통부 TAGO 서버 오류입니다. 1분 뒤 시도하세요.');
      setStationList([]);
    }
  };

  const handleStationSelect = async (event) => {
    const nodeid = event.target.value;
    const station = stationList.find((station) => station.nodeid === nodeid);
    setErrorStationSelect('');
    if (stationName.length < 2) {
      setErrorStationSelect('정류소명은 최소 2자 이상 입력해야 합니다.');
      return;
    }
    setSelectedStationName(station?.nodenm);
    setSelectedStationNo(station?.nodeno);
    setSelectedStation(station);
    if (station) {
      loadArrivalInfo(station);
    }
  };

  const loadArrivalInfo = async (station) => {
    console.log('Selected station state:', station);
    if (!station || !station.nodeid) {
      setErrorArrivalInfo('잘못된 접근입니다. 정류소명을 다시 검색하세요.');
      return;
    }
    try {
      const data = await fetchArrivalInfoList(selectedCity, station.nodeid);
      setArrivalInfo(data);
    } catch (error) {
      console.error('Error loading arrival info:', error);
      setErrorArrivalInfo('국토교통부 TAGO 서버 오류입니다. 1분 뒤 시도하세요.');
    }
  };

  const ArrivalTimer = ({ initialArrtime }) => {
    const [arrtime, setArrtime] = useState(initialArrtime);

    useEffect(() => {
      const timer = setInterval(() => {
        setArrtime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    }, []);

    const formatArrivalTime = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;

      if (hours > 0) {
        return `${hours}시간 ${minutes}분 ${remainingSeconds}초 남음`;
      } else if (minutes > 0) {
        return `${minutes}분 ${remainingSeconds}초 남음`;
      } else if (remainingSeconds > 0) {
        return `${remainingSeconds}초 남음`;
      } else {
        return <strong>지나감</strong>;
      }
    };

    return formatArrivalTime(arrtime);
  };

  return (
    <main className={styles.weabur}>
      <div className={styles.container}>
        <div className={styles.search}>
          <div className={styles['form-group']}>
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
            {cityList.length > 0 && (
              <>
                <hr />
                <form>
                  <fieldset>
                    <legend>도시 선택폼</legend>
                    <div>
                      <Select onChange={handleCitySelect} value={selectedCity}>
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
                        <Select onChange={handleStationSelect} value={selectedStation}>
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
        {selectedStationName && (
          <header>
            <h1>
              <LocationIcon />
              <span aria-label="정류소 이름">{selectedStationName}</span>
              {selectedStationNo && <em aria-label="정류소 번호">{selectedStationNo}</em>}
            </h1>
          </header>
        )}
        {errorCitySearch && (
          <div className={styles.notice}>
            <div className={styles.warning}>
              <p>※ {errorCitySearch}</p>
            </div>
          </div>
        )}
        {errorStationSearch && (
          <div className={styles.notice}>
            <div className={styles.warning}>
              <p>※ {errorStationSearch}</p>
            </div>
          </div>
        )}
        {errorStationSelect && (
          <div className={styles.notice}>
            <div className={styles.warning}>
              <p>※ {errorStationSelect}</p>
            </div>
          </div>
        )}
        {errorArrivalInfo && (
          <div className={styles.notice}>
            <div className={styles.warning}>
              <p>※ {errorArrivalInfo}</p>
            </div>
          </div>
        )}
        {cityList.length <= 0 && (
          <div className={styles.notice}>
            <p>도시를 먼저 검색해주세요</p>
            <div className={styles.warning}>
              <p>※ 서울, 대전 지역은 현재 서비스 준비 중입니다.</p>
              <p>※ 대전은 계룡시 한정해서 서비스 중입니다.</p>
            </div>
          </div>
        )}
        {cityList.length > 0 && selectedCity === '' && (
          <div className={styles.notice}>
            <p>도시를 선택해주세요</p>
          </div>
        )}
        {selectedCity && stationList.length <= 0 && (
          <div className={styles.notice}>
            <p>정류소를 검색해주세요</p>
          </div>
        )}
        {selectedStationName == '' && selectedCity && stationList.length > 0 && arrivalInfo.length <= 0 && (
          <div className={styles.notice}>
            <p>정류소를 선택해주세요</p>
          </div>
        )}
        {selectedStationName && !errorArrivalInfo && (
          <>
            <div className={styles.mixed}>
              <div className={styles.schedule}>
                {arrivalInfo.length > 0 ? (
                  <div className={styles.item}>
                    {arrivalInfo.slice(0, 2).map((info, index) => (
                      <div key={index} className={styles.nextup}>
                        <div className={styles.routeno}>
                          <dl>
                            <dt>노선(버스)번호</dt>
                            <dd>{info.routeno}</dd>
                          </dl>
                        </div>
                        <div className={styles.info}>
                          <div className={styles.type}>
                            <div className={styles.route}>
                              <dl>
                                <dt>노션(버스)유형</dt>
                                <dd>{info.routetp}</dd>
                              </dl>
                            </div>
                            <div className={styles.vehicle}>
                              <dl>
                                <dt>차량유형(저상버스 유무)</dt>
                                <dd>
                                  {info.vehicletp === '저상버스' ? <DisabledIcon /> : <i />}
                                  <span>{info.vehicletp}</span>
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
              <div className={styles.weather}>
                <div className={styles.now}>
                  <span>2023년 11월 20일</span>
                  <strong>
                    오후 4시 49분
                    <Image
                      src="https://cdn.weatherapi.com/weather/64x64/day/116.png"
                      width="48"
                      height="48"
                      unoptimized
                      priority
                      alt="Partly cloudy"
                    />
                  </strong>
                </div>
                <div className={styles.temp}>
                  <dl>
                    <dt>
                      <span>현재기온</span>
                      <TempIcon />
                    </dt>
                    <dd>
                      <strong>10</strong>
                      <span>°C</span>
                    </dd>
                  </dl>
                </div>
                <div className={styles.dust}>
                  <dl>
                    <div>
                      <dt>
                        <span>미세먼지</span>
                        <DustIcon />
                      </dt>
                      <dd>
                        <strong>10</strong>
                        <span>㎍/㎥</span>
                      </dd>
                    </div>
                    <div>
                      <dt>
                        <span>초미세먼지</span>
                        <DustIcon />
                      </dt>
                      <dd>
                        <strong>10</strong>
                        <span>㎍/㎥</span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
            <div className={styles.next}>
              {arrivalInfo.length > 2 && !errorArrivalInfo && (
                <PerfectScrollbar className={styles['next-list']}>
                  <ul>
                    {arrivalInfo.slice(2).map((info, index) => (
                      <li key={index}>
                        <div className={styles.nextup}>
                          <div className={styles.routeno}>
                            <dl>
                              <dt>노선(버스)번호</dt>
                              <dd>{info.routeno}</dd>
                            </dl>
                          </div>
                          <div className={styles.info}>
                            <div className={styles.type}>
                              <div className={styles.route}>
                                <dl>
                                  <dt>노션(버스)유형</dt>
                                  <dd>{info.routetp}</dd>
                                </dl>
                              </div>
                              <div className={styles.vehicle}>
                                <dl>
                                  <dt>차량유형(저상버스 유무)</dt>
                                  <dd>
                                    {info.vehicletp === '저상버스' ? <DisabledIcon /> : <i />}
                                    <span>{info.vehicletp}</span>
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
            </div>
          </>
        )}
        <footer>
          <div className={styles.copyrights}>
            <p>Copyrights WeaBur.</p>
            <p>저작권자 웨버.</p>
          </div>
          <div className={styles.sites}></div>
        </footer>
      </div>
    </main>
  );
}
