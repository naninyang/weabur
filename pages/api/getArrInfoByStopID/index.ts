import type { NextApiRequest, NextApiResponse } from 'next';
import { parseStringPromise } from 'xml2js';

interface BusStopID {
  BUS_NODE_ID: string;
  BUS_STOP_ID: string;
  CAR_REG_NO: string;
  DESTINATION: string;
  EXTIME_MIN: string;
  EXTIME_SEC: string;
  INFO_OFFER_TM: string;
  LAST_CAT: string;
  LAST_STOP_ID: string;
  MSG_TP: string;
  ROUTE_CD: string;
  ROUTE_NO: string;
  ROUTE_TP: string;
  STATUS_POS: string;
  STOP_NAME: string;
}

interface ApiResponse {
  ServiceResult: {
    msgBody: {
      itemList: BusStopID[];
    };
  };
}

const convertFieldNames = (obj: BusStopID): BusStopID => {
  const newObj: any = {};

  Object.keys(obj).forEach((key) => {
    const newKey = key.toLowerCase().replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
    newObj[newKey] = obj[key as keyof BusStopID];
  });

  return newObj as BusStopID;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { BusStopID } = req.query;
  const apiKey = process.env.DATA_GO_KR_API_SERVICE_KEY;

  try {
    const response = await fetch(
      `http://openapitraffic.daejeon.go.kr/api/rest/arrive/getArrInfoByStopID?serviceKey=${apiKey}&BusStopID=${BusStopID}`,
    );
    const xml = await response.text();
    const data = await parseStringPromise(xml, { explicitArray: false });
    const parsedData: ApiResponse = data as ApiResponse;
    const items = parsedData.ServiceResult.msgBody.itemList;
    if (items) {
      const convertedItems = items.map((item: BusStopID) => convertFieldNames(item));
      res
        .status(200)
        .json({ ...data, ServiceResult: { ...data.ServiceResult, msgBody: { itemList: convertedItems } } });
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
