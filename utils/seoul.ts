import { StationInfo, BusArrivalInfo } from '@/types';

export async function fetchStationByName(stationName: string): Promise<StationInfo[]> {
  try {
    const response = await fetch(`/api/getStationByName?stSrch=${stationName}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const itemList = Array.isArray(data.msgBody.itemList) ? data.msgBody.itemList : [data.msgBody.itemList];
    return itemList;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
    throw error;
  }
}

export async function fetchBusArrivals(arsId: string): Promise<BusArrivalInfo[]> {
  try {
    const response = await fetch(`/api/getStationByUid?arsId=${arsId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.msgBody.itemList;
  } catch (error) {
    console.error('Error fetching bus arrivals', error);
    throw error;
  }
}
