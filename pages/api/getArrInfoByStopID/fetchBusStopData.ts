import { VercelRequest, VercelResponse } from '@vercel/node';
import { parseStringPromise } from 'xml2js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const busStopID = req.query.BusStopID as string;
  const apiKey = process.env.DATA_GO_KR_API_SERVICE_KEY;

  if (!busStopID || !apiKey) {
    res.status(400).json({ message: 'Missing BusStopID or API Key' });
    return;
  }

  try {
    const response = await fetch(
      `http://openapitraffic.daejeon.go.kr/api/rest/arrive/getArrInfoByStopID?serviceKey=${apiKey}&BusStopID=${busStopID}`,
    );
    const xml = await response.text();
    const xml2json = await parseStringPromise(xml, { explicitArray: false });
    const jsonData = xml2json.ServiceResult.msgBody;
    if (jsonData.itemList) {
      jsonData.ITEM_LIST = jsonData.itemList;
      delete jsonData.itemList;
    }
    res.status(200).json(jsonData);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
