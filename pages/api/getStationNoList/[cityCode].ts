import type { NextApiRequest, NextApiResponse } from 'next';

export default async function getStationNoList(req: NextApiRequest, res: NextApiResponse) {
  const { cityCode, nodeNm } = req.query;

  const apiKey = process.env.DATA_GO_KR_API_SERVICE_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'API key is missing.' });
  }

  const url = `https://apis.data.go.kr/1613000/BusSttnInfoInqireService/getSttnNoList?serviceKey=${apiKey}&cityCode=${cityCode}&nodeNm=${nodeNm}&_type=json&numOfRows=100`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.response.header.resultCode !== '00') {
      throw new Error('API call returned an error: ' + data.response.header.resultMsg);
    }

    if (data.response.body.items === '') {
      return res.status(404).json({ message: 'No station found.' });
    }

    const stationInfo = data.response.body.items.item;

    res.status(200).json(stationInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
