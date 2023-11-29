# 웨버 WeaBur

버스 정류소의 버스도착정보 LED 느낌의 글꼴과 디자인 UX로 날씨정보 및 버스도착정보를 보여드려요.

날씨정보는 검색한 도시의 관청 위치 기준으로 Weather API(api.weatherapi.com)에서 가져옵니다.

이를테면 부산을 선택하면 부산시청 위치의 날씨정보를 가져오는 식입니다.

국토교통부 TAGO API를 사용하여 데이터를 가져오고 있습니다.

서울, 대전, 원주 지역은 TAGO에서 서비스 지역이 아닙니다.

대전은 계룡시 한정해서 서비스 중이고, 원주는 횡성군 한정해서 서비스 중입니다.

서비스 지역은 추후 업데이트가 예정되어 있습니다.

## 사용된 주요 기술

- Next.js w/ React
- react-device-detect
- TypeScript
- Emotion
- SASS
- Perfect Scrollbar
- PWA

## Troubleshooting

이슈를 등록해 주세요

### 발견되거나 알려진 버그

- NONE

## TO-DO

- 서울 검색
- 대전 검색
- 원주 검색

## Supported PWA App. Download

PWA 형태의 앱 다운로드를 지원합니다.

웹 브라우저를 지원하는 리눅스, MS Windows, Apple macOS, Android, iOS, iPadOS 등 대부분의 모던 디바이스를 지원합니다.

> 텍스트 기반 브라우저는 HTML5, CSS3, 최신 JavaScript 등 지원하는 브라우저 한정하여 지원됩니다.
>
> Safari, FireFox는 Chrome과 화면이 조금 다를 수 있습니다.

앱 내려받는 방법은 서비스 내의 `서비스 소개` 페이지를 참조하세요.

## 주의사항 및 저작권

오픈소스, 오픈 API를 제외한 나머지는 모두 클로이에게 저작권이 있습니다.

### 스텝

- 기획: 클로이 Chloe
- UX 디자인: 클로이 Chloe
- 프론트엔드 개발: 클로이 Chloe

### 오픈 API

- 교통정보: 국토교통부 TAGO API
- 날씨정보: Weather API
