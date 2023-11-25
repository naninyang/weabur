import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.WEATHER_API_KEY;
  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    res.status(400).json({ message: 'Bad request, q parameter is missing or invalid.' });
    return;
  }

  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${q}&aqi=yes`;

  try {
    const weatherResponse = await fetch(url);
    const weatherData = await weatherResponse.json();

    if (!weatherResponse.ok) {
      throw new Error('Weather API error');
    }

    res.status(200).json(weatherData);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
