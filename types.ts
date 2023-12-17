export interface City {
  citycode: string;
  cityname: string;
}

export interface Station {
  arrtime: number;
  nodeid: string;
  nodenm: string;
  nodeno?: number;
  routeid?: string;
  routeno?: number;
}

export interface ArrivalInfo {
  arrprevstationcnt: number;
  arrtime: number;
  nodeid: string;
  nodenm: string;
  routeid: string;
  routeno: number;
  routetp: string;
  vehicletp: string;
}

export type CityLocation = {
  cityTude: string;
  cityName: string;
};

export type StationInfo = {
  arsId: string;
  stId: string;
  stNm: string;
  tmY: string;
  tmX: string;
};

export type BusArrivalInfo = {
  busRouteAbrv: string;
  firstTm: string;
  lastTm: string;
  sectNm: string;
  nxtStn: string;
  routeType: string;
  busType1: string;
  busType2: string;
  isArrive1: string;
  isArrive2: string;
  arrmsg1: string;
  arrmsg2: string;
};

export type BusStop = {
  busstopNm: string;
  busStopId: string;
  busNodeId: string;
  gpsLati: string;
  gpsLong: string;
};

export type BusStopID = {
  busNodeId: string;
  busStopId: string;
  carRegNo: string;
  destination: string;
  extimeMin: string;
  extimeSec: string;
  infoOfferTm: string;
  lastCat: string;
  lastStopId: string;
  msgTp: string;
  routeCd: string;
  routeNo: string;
  routeTp: string;
  statusPos: string;
  stopName: string;
};
