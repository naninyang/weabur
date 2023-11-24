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
