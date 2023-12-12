import { useEffect, useState } from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';
import { images } from '@/images';
import styles from '@/styles/home.module.sass';

interface WeatherInfo {
  temperature: string;
  conditionIconUrl: string;
  conditionIconTxt: string;
  pm2_5: number;
  pm10: number;
}

const DustIcon = styled.i({
  background: `url(${images.icons.dust}) no-repeat 50% 50%/contain`,
});

const InfoIcon = styled.button({
  background: `url(${images.icons.info}) no-repeat 50% 50%/contain`,
});

export default function WeatherSeoul({ latitude, longitude }: { latitude: string; longitude: string }) {
  const [seoulDate, setSeoulDate] = useState<string>('');
  const [seoulTime, setSeoulTime] = useState<string>('');
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const now = new Date();
    const seoulDateFormatted = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Seoul',
    }).format(now);
    const seoulTimeFormatted = new Intl.DateTimeFormat('ko-KR', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'Asia/Seoul',
    }).format(now);

    setSeoulDate(seoulDateFormatted);
    setSeoulTime(seoulTimeFormatted);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoading(true);
      try {
        const weatherResponse = await fetch(`/api/weather?q=${latitude},${longitude}`);
        const weatherData = await weatherResponse.json();

        if (weatherResponse.ok) {
          setWeatherInfo({
            temperature: weatherData.current.temp_c,
            conditionIconUrl: `https:${weatherData.current.condition.icon}`,
            conditionIconTxt: weatherData.current.condition.text,
            pm2_5: weatherData.current.air_quality.pm2_5,
            pm10: weatherData.current.air_quality.pm10,
          });
        } else {
          console.error('Weather API error:', weatherData);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);
  return (
    <div className={styles.weather}>
      {isLoading ? (
        <p className={styles.loading}>
          <span>로딩 중</span>
          <i />
        </p>
      ) : weatherInfo ? (
        <>
          <div className={styles.now}>
            <span>
              <i>
                <InfoIcon type="button" />
                <em>
                  선택한 정류소의
                  <br />
                  위도, 경도 위치의 날씨 정보입니다.
                </em>
              </i>
              {seoulDate}
            </span>
            <strong>{seoulTime} 업데이트 기준</strong>
          </div>
          <div className={styles.info}>
            <div className={styles.temp}>
              <dl>
                <dt>
                  <span>현재기온</span>
                  <Image
                    src={weatherInfo.conditionIconUrl}
                    width="48"
                    height="48"
                    unoptimized
                    priority
                    alt={weatherInfo.conditionIconTxt}
                  />
                </dt>
                <dd>
                  <strong>{weatherInfo.temperature}</strong>
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
                    <strong>{weatherInfo.pm10}</strong>
                    <span>㎍/㎥</span>
                  </dd>
                </div>
                <div>
                  <dt>
                    <span>초미세먼지</span>
                    <DustIcon />
                  </dt>
                  <dd>
                    <strong>{weatherInfo.pm2_5}</strong>
                    <span>㎍/㎥</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </>
      ) : (
        <p>
          일시적으로 날씨 정보를 <span>불러올 수 없습니다</span>
        </p>
      )}
    </div>
  );
}
