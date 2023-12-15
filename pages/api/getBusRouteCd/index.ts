import { NextApiRequest, NextApiResponse } from 'next';
import { parseStringPromise } from 'xml2js';

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

const convertFieldNames = (obj: BusStop): BusStop => {
  const newObj: any = {};

  Object.keys(obj).forEach((key) => {
    const newKey = key.toLowerCase().replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
    newObj[newKey] = obj[key as keyof BusStop];
  });

  return newObj as BusStop;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { routeCd } = req.query;
  const apiKey = process.env.DATA_GO_KR_API_SERVICE_KEY;
  let processedData: BusStop[] = [];

  try {
    for (let page = 1; page <= 118; page++) {
      const response = await fetch(
        `http://openapitraffic.daejeon.go.kr/api/rest/busRouteInfo/getStaionByRouteAll?serviceKey=${apiKey}&reqPage=${page}`,
      );
      const xml = await response.text();
      const result = await parseStringPromise(xml, { explicitArray: false });
      const items = result.ServiceResult.msgBody.itemList as BusStop[];

      const currentPageData = items.filter((item) => {
        const busstopNm = Array.isArray(item.ROUTE_CD) ? item.ROUTE_CD[0] : item.ROUTE_CD;
        return busstopNm && busstopNm.includes(routeCd);
      });

      processedData = processedData.concat(currentPageData);
    }
    const camelCaseData = processedData.map((item) => convertFieldNames(item));
    res.status(200).json(camelCaseData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
