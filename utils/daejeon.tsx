import { BusStop, BusStopID } from '@/types';

export async function fetchStationsByName(searchTerm: string): Promise<BusStop[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getStaionByRouteAll?searchTerm=${searchTerm}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching stations:', error);
    throw error;
  }
}

export async function fetchArrivalInfoByStopID(busNodeId: string): Promise<BusStopID[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getArrInfoByStopID?BusStopID=${busNodeId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const sortedBusPosInfo = data.itemList.sort((a: any, b: any) => {
      const timeA = parseInt(a.extimeSec, 10);
      const timeB = parseInt(b.extimeSec, 10);
      return timeA - timeB;
    });

    return sortedBusPosInfo.map((busPos: any) => ({
      ...busPos,
      routeTp: busPos.routeTp.replace(/\s/g, ''),
    }));
  } catch (error) {
    console.error('Error fetching bus arrival info:', error);
    throw error;
  }
}
