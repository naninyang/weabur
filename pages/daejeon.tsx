import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { images } from '@/images';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WeatherDaejeon from '@/components/WeatherDaejeon';
import { hex, mq, vw } from '@/styles/designSystem';
import styles from '@/styles/home.module.sass';

interface BusStop {
  busstopNm: string;
  busStopId: string;
  busNodeId: string;
  gpsLati: string;
  gpsLong: string;
}

interface BusStopID {
  busNodeId: string;
  busStopId: string;
  carRegNo: string;
  destination: string;
  extimeMin: string;
  extimeSec: string;
  infoOfferTm: string;
  lastCat: string;
  lastStopId: string;
  msgTp: string;
  routeCd: string;
  routeNo: string;
  routeTp: string;
  statusPos: string;
  stopName: string;
}

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
  const [searchTerm, setSearchTerm] = useState('');
  const [busStops, setBusStops] = useState<BusStop[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [selectedBusStop, setSelectedBusStop] = useState({
    busstopNm: '',
    busStopId: '',
    busNodeId: '',
    gpsLati: '',
    gpsLong: '',
  });

  const fetchStationByName = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.length < 3) {
      setSearched(true);
      setLoading(false);
      setBusStops([]);
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const response = await fetch(`/api/getStaionByRouteAll?searchTerm=${searchTerm}`);
      const data = await response.json();
      setBusStops(data);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const [busPosInfo, setBusPosInfo] = useState<BusStopID[] | null>(null);

  const handleSelectChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    const selectedId = event.target.value;
    const selected = busStops.find((busStop) => busStop.busStopId === selectedId);

    if (!selected) return;

    try {
      const response = await fetch(`/api/getArrInfoByStopID?BusStopID=${selected.busNodeId}`);
      const data = await response.json();

      const sortedBusPosInfo = [...data.ServiceResult.msgBody.itemList].sort((a, b) => {
        const timeA = parseInt(a.extimeSec, 10);
        const timeB = parseInt(b.extimeSec, 10);
        return timeA - timeB;
      });

      const updatedBusPosInfo = sortedBusPosInfo.map((busPos) => ({
        ...busPos,
        routeTp: busPos.routeTp.replace(/\s/g, ''),
      }));

      setBusPosInfo(updatedBusPosInfo);
      console.log('busPosInfo:::::::::: ', busPosInfo);
    } catch (error) {
      console.error('Error:', error);
    }

    const selectedData = {
      busstopNm: selected.busstopNm,
      busStopId: selected.busStopId,
      busNodeId: selected.busNodeId,
      gpsLati: selected.gpsLati,
      gpsLong: selected.gpsLong,
    };

    setSelectedBusStop(selectedData);
  };

  const busColors: { [key: string]: string } = {
    1: '#90C73D',
    2: '#386DE8',
    3: '#3CC344',
    4: '#90C73D',
    5: '#90C73D',
    6: '#90C73D',
  };

  const busTypes: { [key: string]: string } = {
    1: '급행버스',
    2: '간선버스',
    3: '지선버스',
    4: '외곽버스',
    5: '마을버스',
    6: '첨단버스',
  };

  const lastCat: { [key: string]: string } = {
    1: '첫차',
    2: '막차',
    3: '일반',
  };

  const msg: { [key: string]: string } = {
    '01': '도착',
    '02': '출발',
    '03': '후 도착',
    '04': '교차로 통과',
    '06': '진입 중',
    '07': '차고지 대기중',
  };

  function formatTime(extimeSec: string) {
    const totalSeconds = parseInt(extimeSec, 10);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes > 0 ? `${minutes}분 ` : ''}${seconds}초`;
  }

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
              <form onSubmit={fetchStationByName}>
                <fieldset>
                  <legend>정류소명 검색폼</legend>
                  <div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setSearched(false);
                      }}
                    />
                  </div>
                  <button type="submit">
                    <span>검색하기</span>
                    <SearchIcon />
                  </button>
                </fieldset>
              </form>
            </div>
            {busStops.length > 0 && (
              <>
                <hr />
                <form>
                  <fieldset>
                    <legend>도시 선택폼</legend>
                    <div>
                      <select onChange={handleSelectChange}>
                        <option value="">정류소 선택</option>
                        {busStops.map((busStop, index) => (
                          <option key={index} value={busStop.busStopId}>
                            {busStop.busstopNm} {busStop.busStopId && `(${busStop.busStopId})`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </fieldset>
                </form>
              </>
            )}
          </div>
        </div>
        <Nav />
        {selectedBusStop.busstopNm && (
          <div className={styles.header}>
            <h1>
              <s>
                <LocationIcon />
              </s>
              <span>
                <span aria-label="정류소 이름">{selectedBusStop.busstopNm}</span>
                {selectedBusStop.busStopId && <em aria-label="정류소 번호">{selectedBusStop.busStopId}</em>}
              </span>
            </h1>
          </div>
        )}
        {!searched && (
          <div className={styles.notice}>
            <p>정류소를 먼저 검색해주세요</p>
          </div>
        )}
        {searched && searchTerm.length < 3 && (
          <div className={styles.notice}>
            <p>정류소를 검색해주세요</p>
            <div className={styles.warning}>
              <p>※ 도시명은 최소 3자 이상 입력해야 합니다.</p>
            </div>
          </div>
        )}
        {loading && (
          <p className={styles.loading}>
            <span>정류소 목록 불러오는 중</span>
            <i />
          </p>
        )}
        {searched && !loading && busStops.length === 0 && (
          <div className={styles.notice}>
            <p>정류소를 검색해주세요</p>
            <div className={styles.warning}>
              <p>※ 찾으려는 도시가 없습니다.</p>
            </div>
          </div>
        )}
        {busStops.length > 0 && !selectedBusStop.busstopNm && (
          <div className={styles.notice}>
            <p>정류소를 선택해주세요</p>
          </div>
        )}
        {busPosInfo && busPosInfo.length > 0 && (
          <div className={styles.misc}>
            <div className={styles.mixed}>
              <div className={styles.schedule}>
                {busPosInfo.length > 0 ? (
                  <div className={styles.item}>
                    {busPosInfo.length > 1 ? (
                      <>
                        {busPosInfo.slice(0, 2).map((info, index) => (
                          <div key={index} className={styles.nextup}>
                            <div className={styles.routeno}>
                              <dl>
                                <dt>노선(버스)번호</dt>
                                <dd style={{ color: `${busColors[info.routeTp]}` }}>{info.routeNo}</dd>
                              </dl>
                            </div>
                            <div className={styles.info}>
                              <div className={styles.type}>
                                <div className={styles.route}>
                                  <dl>
                                    <dt>노션(버스)유형</dt>
                                    <dd style={{ color: busColors[info.routeTp as keyof typeof busColors] }}>
                                      {busTypes[info.routeTp]}
                                    </dd>
                                  </dl>
                                </div>
                                <div className={styles.vehicle}>
                                  <dl>
                                    <dt>종점역</dt>
                                    <dd>
                                      {info.lastCat === '3' || info.lastCat === '0'
                                        ? info.destination
                                        : `${lastCat[info.lastCat]} / ${info.destination}`}
                                    </dd>
                                  </dl>
                                </div>
                              </div>
                              <div className={styles.time}>
                                <dl>
                                  <dt>도착 예정 시간</dt>
                                  <dd>{info.msgTp === '03' ? `${formatTime(info.extimeSec)} 후` : msg[info.msgTp]}</dd>
                                </dl>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <>
                        {busPosInfo.slice(0, 2).map((info, index) => (
                          <div key={index} className={styles.nextup}>
                            <div className={styles.routeno}>
                              <dl>
                                <dt>노선(버스)번호</dt>
                                <dd style={{ color: `${busColors[info.routeTp]}` }}>{info.routeNo}</dd>
                              </dl>
                            </div>
                            <div className={styles.info}>
                              <div className={styles.type}>
                                <div className={styles.route}>
                                  <dl>
                                    <dt>노션(버스)유형</dt>
                                    <dd style={{ color: busColors[info.routeTp as keyof typeof busColors] }}>
                                      {busTypes[info.routeTp]}
                                    </dd>
                                  </dl>
                                </div>
                                <div className={styles.vehicle}>
                                  <dl>
                                    <dt>종점역</dt>
                                    <dd>
                                      {info.lastCat === '3' || info.lastCat === '0'
                                        ? info.destination
                                        : `${lastCat[info.lastCat]} / ${info.destination}`}
                                    </dd>
                                  </dl>
                                </div>
                              </div>
                              <div className={styles.time}>
                                <dl>
                                  <dt>도착 예정 시간</dt>
                                  <dd>{info.msgTp === '03' ? `${formatTime(info.extimeSec)} 후` : msg[info.msgTp]}</dd>
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
              <WeatherDaejeon latitude={selectedBusStop.gpsLati} longitude={selectedBusStop.gpsLong} />
            </div>
            <div className={styles.next}>
              {busPosInfo.length > 2 && (
                <PerfectScrollbar className={styles['next-list']}>
                  <ul>
                    {busPosInfo.slice(2).map((info, index) => (
                      <li key={index}>
                        <div className={styles.nextup}>
                          <div className={styles.routeno}>
                            <dl>
                              <dt>노선(버스)번호</dt>
                              <dd style={{ color: `${busColors[info.routeTp]}` }}>{info.routeNo}</dd>
                            </dl>
                          </div>
                          <div className={styles.info}>
                            <div className={styles.type}>
                              <div className={styles.route}>
                                <dl>
                                  <dt>노션(버스)유형</dt>
                                  <dd style={{ color: busColors[info.routeTp as keyof typeof busColors] }}>
                                    {busTypes[info.routeTp]}
                                  </dd>
                                </dl>
                              </div>
                              <div className={styles.vehicle}>
                                <dl>
                                  <dt>종점역</dt>
                                  <dd>
                                    {info.lastCat === '3' || info.lastCat === '0'
                                      ? info.destination
                                      : `${lastCat[info.lastCat]} / ${info.destination}`}
                                  </dd>
                                </dl>
                              </div>
                            </div>
                            <div className={styles.time}>
                              <dl>
                                <dt>도착 예정 시간</dt>
                                <dd>{info.msgTp === '03' ? `${formatTime(info.extimeSec)} 후` : msg[info.msgTp]}</dd>
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
