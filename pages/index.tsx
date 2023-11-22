import Image from 'next/image';
import styled from '@emotion/styled';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { images } from '@/images';
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
  return (
    <main className={styles.weabur}>
      <div className={styles.container}>
        <div className={styles.search}>
          <div className={styles['form-group']}>
            <form>
              <fieldset>
                <legend>도시 검색폼</legend>
                <div>
                  <input type="search" placeholder="도시 검색" />
                </div>
                <button type="submit">
                  <span>검색하기</span>
                  <SearchIcon />
                </button>
              </fieldset>
            </form>
            <hr />
            <form>
              <fieldset>
                <legend>도시 선택폼</legend>
                <div>
                  <Select>
                    <option>도시 선택</option>
                  </Select>
                </div>
              </fieldset>
            </form>
          </div>
          <hr />
          <div className={styles['form-group']}>
            <form>
              <fieldset>
                <legend>정류소 검색폼</legend>
                <input type="search" placeholder="정류소 검색" />
                <button type="submit">
                  <span>검색하기</span>
                  <SearchIcon />
                </button>
              </fieldset>
            </form>
            <hr />
            <form>
              <fieldset>
                <legend>정류소 선택폼</legend>
                <Select>
                  <option>정류소 선택</option>
                </Select>
              </fieldset>
            </form>
          </div>
        </div>
        <header>
          <h1>
            <LocationIcon />
            <span>부산시청</span>
            <em>13708</em>
          </h1>
        </header>
        <div className={styles.mixed}>
          <div className={styles.schedule}>
            <div className={styles.nextup}>
              <div className={styles.routeno}>
                <dl>
                  <dt>노선(버스)번호</dt>
                  <dd>87</dd>
                </dl>
              </div>
              <div className={styles.info}>
                <div className={styles.type}>
                  <div className={styles.route}>
                    <dl>
                      <dt>노션(버스)유형</dt>
                      <dd>일반버스</dd>
                    </dl>
                  </div>
                  <div className={styles.vehicle}>
                    <dl>
                      <dt>차량유형(저상버스 유무)</dt>
                      <dd>
                        <i />
                        <span>일반차량</span>
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className={styles.time}>
                  <dl>
                    <dt>도착 예정 시간</dt>
                    <dd>22분 31초 남음</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className={styles.nextup}>
              <div className={styles.routeno}>
                <dl>
                  <dt>노선(버스)번호</dt>
                  <dd>87</dd>
                </dl>
              </div>
              <div className={styles.info}>
                <div className={styles.type}>
                  <div className={styles.route}>
                    <dl>
                      <dt>노션(버스)유형</dt>
                      <dd>일반버스</dd>
                    </dl>
                  </div>
                  <div className={styles.vehicle}>
                    <dl>
                      <dt>차량유형(저상버스 유무)</dt>
                      <dd>
                        <DisabledIcon />
                        <span>저상버스</span>
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className={styles.time}>
                  <dl>
                    <dt>도착 예정 시간</dt>
                    <dd>22분 31초 남음</dd>
                  </dl>
                </div>
              </div>
            </div>
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
        <div className={styles.next}>
          <PerfectScrollbar className={styles['next-list']}>
            <ul>
              <li>
                <div className={styles.nextup}>
                  <div className={styles.routeno}>
                    <dl>
                      <dt>노선(버스)번호</dt>
                      <dd>87</dd>
                    </dl>
                  </div>
                  <div className={styles.info}>
                    <div className={styles.type}>
                      <div className={styles.route}>
                        <dl>
                          <dt>노션(버스)유형</dt>
                          <dd>일반버스</dd>
                        </dl>
                      </div>
                      <div className={styles.vehicle}>
                        <dl>
                          <dt>차량유형(저상버스 유무)</dt>
                          <dd>
                            <i />
                            <span>일반차량</span>
                          </dd>
                        </dl>
                      </div>
                    </div>
                    <div className={styles.time}>
                      <dl>
                        <dt>도착 예정 시간</dt>
                        <dd>22분 31초 남음</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className={styles.nextup}>
                  <div className={styles.routeno}>
                    <dl>
                      <dt>노선(버스)번호</dt>
                      <dd>87</dd>
                    </dl>
                  </div>
                  <div className={styles.info}>
                    <div className={styles.type}>
                      <div className={styles.route}>
                        <dl>
                          <dt>노션(버스)유형</dt>
                          <dd>일반버스</dd>
                        </dl>
                      </div>
                      <div className={styles.vehicle}>
                        <dl>
                          <dt>차량유형(저상버스 유무)</dt>
                          <dd>
                            <DisabledIcon />
                            <span>저상버스</span>
                          </dd>
                        </dl>
                      </div>
                    </div>
                    <div className={styles.time}>
                      <dl>
                        <dt>도착 예정 시간</dt>
                        <dd>22분 31초 남음</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className={styles.nextup}>
                  <div className={styles.routeno}>
                    <dl>
                      <dt>노선(버스)번호</dt>
                      <dd>87</dd>
                    </dl>
                  </div>
                  <div className={styles.info}>
                    <div className={styles.type}>
                      <div className={styles.route}>
                        <dl>
                          <dt>노션(버스)유형</dt>
                          <dd>일반버스</dd>
                        </dl>
                      </div>
                      <div className={styles.vehicle}>
                        <dl>
                          <dt>차량유형(저상버스 유무)</dt>
                          <dd>
                            <i />
                            <span>일반차량</span>
                          </dd>
                        </dl>
                      </div>
                    </div>
                    <div className={styles.time}>
                      <dl>
                        <dt>도착 예정 시간</dt>
                        <dd>22분 31초 남음</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className={styles.nextup}>
                  <div className={styles.routeno}>
                    <dl>
                      <dt>노선(버스)번호</dt>
                      <dd>87</dd>
                    </dl>
                  </div>
                  <div className={styles.info}>
                    <div className={styles.type}>
                      <div className={styles.route}>
                        <dl>
                          <dt>노션(버스)유형</dt>
                          <dd>일반버스</dd>
                        </dl>
                      </div>
                      <div className={styles.vehicle}>
                        <dl>
                          <dt>차량유형(저상버스 유무)</dt>
                          <dd>
                            <i />
                            <span>일반차량</span>
                          </dd>
                        </dl>
                      </div>
                    </div>
                    <div className={styles.time}>
                      <dl>
                        <dt>도착 예정 시간</dt>
                        <dd>22분 31초 남음</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </PerfectScrollbar>
        </div>
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
