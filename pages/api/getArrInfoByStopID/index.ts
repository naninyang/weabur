import type { NextApiRequest, NextApiResponse } from 'next';

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
  itemList: BusStopID[];
}

const convertFieldNames = (data: any): ApiResponse => {
  const convertedItemList: BusStopID[] = data.ITEM_LIST.map((item: BusStopID) => {
    const convertedItem: any = {};
    Object.keys(item).forEach((key) => {
      const newKey = key.toLowerCase().replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
      convertedItem[newKey] = item[key as keyof BusStopID];
    });
    return convertedItem as BusStopID;
  });
  return { itemList: convertedItemList };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { BusStopID } = req.query;

  if (!BusStopID) {
    res.status(400).json({ message: 'BusStopID is required' });
    return;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/getArrInfoByStopID/fetchBusStopData?BusStopID=${BusStopID}`,
    );
    const data: ApiResponse = await response.json();
    const convertedData = convertFieldNames(data);
    res.status(200).json(convertedData);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
