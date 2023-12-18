# 웨버 WeaBur

버스 정류소의 버스도착정보 LED 느낌의 글꼴과 디자인 UX로 날씨정보 및 버스도착정보를 보여드려요.

1. `기타 지역` 정류소 정보는 `국토교통부 TAGO`를 사용하여 데이터를 가져오고,
   이 경우 날씨정보는 검색한 도시의 관청 위치 기준으로 `Weather API`에서 가져옵니다.
   이를테면 부산을 선택하면 부산시청 위치의 날씨정보를 가져오는 식입니다.

2. 원주시는 횡성군만 지원합니다. (`기타 지역` 선택)

3. 서울특별시 정류소 정보는 `서울특별시 정류소정보조회서비스`에서 데이터를 실시간으로 가져옵니다.
   서울특별시는 선택한 정류소의 위도, 경도 기준으로 날씨 정보를 가져옵니다.

4. 대전광역시 정류소 정보는 `대전광역시 버스정보시스템`에서 데이터를 실시간으로 가져옵니다.
   대전광역시는 선택한 정류소의 위도, 경도 기준으로 날씨 정보를 가져옵니다.

## 사용된 주요 기술

### Frontend

- Next.js w/ React
- react-device-detect
- TypeScript
- Emotion
- SASS
- Perfect Scrollbar
- PWA

### Backend

- AWS EC2
- Sentry
- PM2
- NginX
- Github Actions

## Troubleshooting

이슈를 등록해 주세요

### 발견되거나 알려진 버그

- NONE

## TO-DO

- 서울특별시 에러 화면, 로딩 인디케이터 작업
- 대전광역시 에러 화면, 로딩 인디케이터, 첫차/막차 디버깅

## 개발 비하인드

`data.go.kr`의 `서울특별시_정류소정보조회 서비스`, `대전광역시_노선정보조회 서비스`, `대전광역시_버스 위치정보 조회 서비스` 이상 3개 API는 `활용신청` 할 때 2-3시간 뒤에 정상 사용이 가능하다고 되어 있고, 활용신청 후, 자동으로 `승인`상태가 되는데 실제로는 `serviceKey`를 사용할 수 없습니다.

그래서 `오류신고 및 문의`로 serviceKey를 사용할 수 없다고 오류신고를 해야했고, 관리자가 이 문제를 확인하기 전까지는 API를 사용할 수 없었습니다.

## Supported PWA App. Download

PWA 형태의 앱 다운로드를 지원합니다.

웹 브라우저를 지원하는 리눅스, MS Windows, Apple macOS, Android, iOS, iPadOS 등 대부분의 모던 디바이스를 지원합니다.

> 텍스트 기반 브라우저는 HTML5, CSS3, 최신 JavaScript 등 지원하는 브라우저 한정하여 지원되며,
>
> Safari, Firefox는 Chromium 웹브라우저(Google Chrome, MS Edge, Brave, NAVER whale, Osiris, Iron)와 화면이 조금 다를 수 있습니다.

> PWA 앱인 경우, macOS Safari, iOS/iPadOS 환경에서는 Safari와 모양 및 동작이 Safari WebView와 모양이 유사하며,
>
> macOS Chrome, Windows Chrome, Android Chrome에서 내려받은 경우 Chrome과 모양 및 동작이 Chrome WebView와 모양이 유사합니다.

앱 내려받는 방법은 서비스 내의 `서비스 소개` 페이지를 참조하세요.

## 주의사항 및 저작권

오픈소스, 오픈 API를 제외한 나머지는 모두 클로이에게 저작권이 있습니다.

### 스텝

- 기획: 클로이 Chloe
- UX 디자인: 클로이 Chloe
- 프론트엔드 개발: 클로이 Chloe

### 오픈 API

- 교통정보:
  - 국토교통부 TAGO API
  - 서울특별시 정류소정보조회서비스 API
  - 대전광역시 버스정보시스템 API
- 날씨정보: Weather API (api.weatherapi.com)
  - `기타지역`의 날씨정보를 위한 위치정보는 수동으로 경도값과 위도값을 찾아서 자체 API를 만들어서 사용하였습니다.

### 등록상표

- Safari, macOS, iOS, iPadOS는 미국과 그 밖의 나라 및 지역에서 등록된 Apple Inc.의 상표입니다.
- Google Chrome, MS Edge, Brave, NAVER whale, Osiris, Iron는 각 회사에 등록된 상표입니다.
- Firefox는 Mozilla 재단에 등록된 상표입니다.
- WeaBur의 UX 디자인과 상표는 대한민국 저작권법에 의거하여 보호됩니다.
