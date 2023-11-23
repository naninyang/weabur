import type { NextApiRequest, NextApiResponse } from 'next';

export default async function getCityCodeList(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.DATA_GO_KR_API_SERVICE_KEY;

  if (!apiKey) {
    return res.status(500).json({ message: 'API key is missing.' });
  }

  const url = `https://apis.data.go.kr/1613000/BusSttnInfoInqireService/getCtyCodeList?serviceKey=${apiKey}&_type=json&numOfRows=100`;

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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
