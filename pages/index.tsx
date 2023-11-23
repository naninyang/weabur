import { useEffect, useState } from 'react';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
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
  const [error, setError] = useState('');

  const handleCitySearch = async (e) => {
    e.preventDefault();
    setError('');
    if (cityName.length < 2) {
      setError('도시명은 최소 2자 이상 입력해야 합니다.');
      return;
    }
    try {
      const cities = await fetchCityCodeList();
      const filteredCities = cities.filter((city) => city.cityname.includes(cityName));
      if (filteredCities.length > 0) {
        setCityList(filteredCities);
      } else {
        setError('검색된 도시가 없습니다.');
      }
    } catch (err) {
      setError('도시 정보를 불러오는 중 오류가 발생했습니다.');
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
    setError('');
    if (!selectedCity) {
      setError('먼저 도시를 선택해주세요.');
      return;
    }
    try {
      const stations = await fetchStationNoList(selectedCity, stationName);
      console.log('selectedCity: ', selectedCity);
      console.log('stationName: ', stationName);
      if (stations.length === 0) {
        setError('검색된 정류소가 없습니다.');
        setStationList([]);
      } else {
        setStationList(stations);
      }
    } catch (err) {
      setError('정류소 정보를 불러오는 중 오류가 발생했습니다.');
      setStationList([]);
    }
  };

  const handleStationSelect = async (event) => {
    const nodeid = event.target.value;
    const station = stationList.find((station) => station.nodeid === nodeid);
    console.log('selectedStation: ', selectedStation);
    if (stationName.length < 2) {
      setError('정류소명은 최소 2자 이상 입력해야 합니다.');
      return;
    }
    if (selectedStation) {
      setSelectedStationName(selectedStation.nodenm);
      setSelectedStationNo(selectedStation.nodeno);
    }
    if (station) {
      setSelectedStationName(station.nodenm);
      setSelectedStationNo(station.nodeno);
      setSelectedStation(station);
      loadArrivalInfo();
    }
  };

  const loadArrivalInfo = async () => {
    console.log('loadArrivalInfo?');
    console.log('Selected station state:', selectedStation);
    console.log('Selected city:', selectedCity);
    if (!selectedStation || typeof selectedStation === 'string' || !selectedCity) {
      console.log('정류소와 도시를 선택해 주세요.');
      setError('정류소와 도시를 선택해 주세요.');
      return;
    }

    try {
      const data = await fetchArrivalInfoList(selectedCity, selectedStation.nodeid);
      console.log('Arrival data:', data);
      setArrivalInfo(data);
    } catch (error) {
      console.error('Error loading arrival info:', error);
      setError('도착 정보를 불러오는 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    if (selectedStation && selectedCity) {
      loadArrivalInfo();
    }
  }, [selectedStation, selectedCity]);

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
        return `${hours}시간 ${minutes}분 ${remainingSeconds}초`;
      } else if (minutes > 0) {
        return `${minutes}분 ${remainingSeconds}초`;
      } else {
        return `${remainingSeconds}초`;
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
        {arrivalInfo && (
          <>
            <div className={styles.mixed}>
              <div className={styles.schedule}>
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
                            <ArrivalTimer initialArrtime={info.arrtime} /> 남음
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <hr />
              <div className={styles.weather}>
                <div className={styles.now}>
                  <span>2023년 11월 20일 오후</span> <strong>4시 49분</strong>
                  <Image
                    src="https://cdn.weatherapi.com/weather/64x64/day/116.png"
                    width="48"
                    height="48"
                    unoptimized
                    priority
                    alt="Partly cloudy"
                  />
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
            {arrivalInfo.length > 2 && (
              <div className={styles.next}>
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
                                  <ArrivalTimer initialArrtime={info.arrtime} /> 남음
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </PerfectScrollbar>
              </div>
            )}
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
