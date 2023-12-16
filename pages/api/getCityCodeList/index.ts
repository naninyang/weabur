import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.DATA_GO_KR_API_SERVICE_KEY;

  if (!apiKey) {
    return res.status(500).json({ message: 'API key is missing.' });
  }

  const url = `https://apis.data.go.kr/1613000/BusSttnInfoInqireService/getCtyCodeList?serviceKey=${apiKey}&_type=json&numOfRows=100`;
  // 국토교통부_(TAGO)_버스정류소정보 > 도시코드 목록 조회

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.response.header.resultCode !== '00') {
      throw new Error('API call returned an error: ' + data.response.header.resultMsg);
    }

    const cityCodes = data.response.body.items.item.map((city: any) => ({
      citycode: city.citycode,
      cityname: city.cityname,
    }));

    res.status(200).json(cityCodes);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
}
