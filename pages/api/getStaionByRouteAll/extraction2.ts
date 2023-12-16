import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const convertToCamelCase = (obj: any) => {
  const newObj: any = {};
  Object.keys(obj).forEach((key) => {
    const newKey = key.toLowerCase().replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
    newObj[newKey] = obj[key];
  });
  return newObj;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const filePath = path.join(process.cwd(), 'public/data', 'getStaionByRouteAll1.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(rawData);

    const processedData = data.busStations.map((station: any) => {
      const { BUSSTOP_NM, BUS_NODE_ID, BUS_STOP_ID, GPS_LATI, GPS_LONG, ROUTE_CD } = station;
      return convertToCamelCase({ BUSSTOP_NM, BUS_NODE_ID, BUS_STOP_ID, GPS_LATI, GPS_LONG, ROUTE_CD });
    });

    const newFilePath = path.join(process.cwd(), 'public/data', 'getStaionByRouteAll2.json');
    fs.writeFileSync(newFilePath, JSON.stringify({ busStations: processedData }), 'utf-8');

    res.status(200).json({ message: 'Bus stations data processed and saved successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
