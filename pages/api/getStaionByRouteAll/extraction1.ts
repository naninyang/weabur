import type { NextApiRequest, NextApiResponse } from 'next';
import { parseStringPromise } from 'xml2js';
import fs from 'fs';
import path from 'path';

interface BusStop {
  BUSSTOP_ENG_NM: string;
  BUSSTOP_NM: string;
  BUSSTOP_SEQ: string;
  BUSSTOP_TP: string;
  BUS_NODE_ID: string;
  BUS_STOP_ID: string;
  GPS_LATI: string;
  GPS_LONG: string;
  ROAD_NM: string;
  ROAD_NM_ADDR: string;
  ROUTE_CD: string;
  TOTAL_DIST: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const serviceKey = process.env.DATA_GO_KR_API_SERVICE_KEY;
  const totalPages = 118;
  let allItems: BusStop[] = [];

  try {
    for (let page = 1; page <= totalPages; page++) {
      const response = await fetch(
        `http://openapitraffic.daejeon.go.kr/api/rest/busRouteInfo/getStaionByRouteAll?serviceKey=${serviceKey}&reqPage=${page}`,
      );
      const xml = await response.text();
      const result = await parseStringPromise(xml, { explicitArray: false });
      const items = result.ServiceResult.msgBody.itemList;
      allItems = allItems.concat(items);
    }

    const filePath = path.join(process.cwd(), 'public/data', 'getStaionByRouteAll1.json');
    fs.writeFileSync(filePath, JSON.stringify({ busStations: allItems }), 'utf-8');
    res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error fetching and saving data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
