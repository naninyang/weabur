import type { NextApiRequest, NextApiResponse } from 'next';
import { parseStringPromise } from 'xml2js';

async function convertXmlToJson(xmlData: string): Promise<any> {
  try {
    const result = await parseStringPromise(xmlData, { explicitArray: false });
    return result;
  } catch (error) {
    console.error('Error parsing XML:', error);
    throw error;
  }
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { stSrch } = req.query;
  const apiKey = process.env.DATA_GO_KR_API_SERVICE_KEY;
  const url = `http://ws.bus.go.kr/api/rest/stationinfo/getStationByName?serviceKey=${apiKey}&stSrch=${stSrch}`;
  // 서울특별시_정류소정보조회 서비스 > getStationByNameList

  try {
    const response = await fetch(url);
    const xmlData = await response.text();
    const jsonData = await convertXmlToJson(xmlData);
    res.status(200).json(jsonData.ServiceResult);
  } catch (error) {
    res.status(500).json({ message: '서버 오류 발생' });
  }
}
