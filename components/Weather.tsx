import { useEffect, useState } from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';
import { CityLocation } from '@/types';
import { images } from '@/images';
import styles from '@/styles/home.module.sass';

interface WeatherInfo {
  temperature: string;
  conditionIconUrl: string;
  pm2_5: number;
  pm10: number;
}

const TempIcon = styled.i({
  background: `url(${images.icons.temp}) no-repeat 50% 50%/contain`,
});

const DustIcon = styled.i({
  background: `url(${images.icons.dust}) no-repeat 50% 50%/contain`,
});

export default function Weather({ currentCity }: { currentCity: string }) {
  const [seoulDate, setSeoulDate] = useState<string>('');
  const [seoulTime, setSeoulTime] = useState<string>('');
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const interval = setInterval(() => {
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
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoading(true);
      try {
        const cityResponse = await fetch('/api/cityLocation');
        const cities: CityLocation[] = await cityResponse.json();
        const currentCityLocation = cities.find((city) => city.cityName === currentCity);

        if (!currentCityLocation) {
          throw new Error('City not found');
        }

        const weatherResponse = await fetch(`/api/weather?q=${currentCityLocation.cityTude}`);
        const weatherData = await weatherResponse.json();

        if (weatherResponse.ok) {
          setWeatherInfo({
            temperature: weatherData.current.temp_c,
            conditionIconUrl: `http:${weatherData.current.condition.icon}`,
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
  }, [currentCity]);
  return (
    <div className={styles.weather}>
      {isLoading ? (
        <p>Loading weather data...</p>
      ) : weatherInfo ? (
        <>
          <div className={styles.now}>
            <span>{seoulDate}</span>
            <strong>
              {seoulTime}
              <Image
                src={weatherInfo.conditionIconUrl}
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
        </>
      ) : (
        <p>
          일시적으로 날씨 정보를 <span>불러올 수 없습니다</span>
        </p>
      )}
    </div>
  );
}
