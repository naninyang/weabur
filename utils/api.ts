export async function fetchCityCodeList() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getCityCodeList`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const cityCodes = await response.json();
    return cityCodes;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

export async function fetchStationNoList(cityCode: string, nodeNm: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/getStationNoList/${cityCode}?nodeNm=${nodeNm}`,
    );
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('API call failed:', error);
    return [];
  }
}

export async function fetchArrivalInfoList(cityCode: string, nodeId: string) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/getArrivalInfoList/${nodeId}?cityCode=${cityCode}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    data.sort((a, b) => a.arrtime - b.arrtime);
    console.log('Sorted API Data:', data);
    return data;
  } catch (error) {
    console.error('Fetch operation error:', error);
    throw error;
  }
}
