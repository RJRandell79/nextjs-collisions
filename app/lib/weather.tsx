'use client';

import { WiDayCloudy, WiDayRain, WiDaySnow, WiDayWindy, WiDayRainWind, WiDaySnowWind, WiFog, WiNightAltCloudy, WiNightAltRain, WiNightAltSnow, WiNightCloudyGusts, WiNightAltRainWind, WiNightAltSnowWind, WiNightFog } from "react-icons/wi";

const generateWeatherIcons = () => {
    const icons: { [key: string]: JSX.Element } = {};
    const dayIcons = [
      <WiDayCloudy className="mr-2 mb-2 text-3xl" />,
      <WiDayRain className="mr-2 mb-2 text-3xl" />,
      <WiDaySnow className="mr-2 mb-2 text-3xl" />,
      <WiDayWindy className="mr-2 mb-2 text-3xl" />,
      <WiDayRainWind className="mr-2 mb-2 text-3xl" />,
      <WiDaySnowWind className="mr-2 mb-2 text-3xl" />,
      <WiFog className="mr-2 mb-2 text-3xl" />,
    ];
    const nightIcons = [
      <WiNightAltCloudy className="mr-2 mb-2 text-3xl" />,
      <WiNightAltRain className="mr-2 mb-2 text-3xl" />,
      <WiNightAltSnow className="mr-2 mb-2 text-3xl" />,
      <WiNightCloudyGusts className="mr-2 mb-2 text-3xl" />,
      <WiNightAltRainWind className="mr-2 mb-2 text-3xl" />,
      <WiNightAltSnowWind className="mr-2 mb-2 text-3xl" />,
      <WiNightFog className="mr-2 mb-2 text-3xl" />,
    ];
  
    for (let i = 1; i <= 7; i++) {
      icons[`1-${i}`] = dayIcons[i - 1];
      icons[`4-${i}`] = nightIcons[i - 1];
      icons[`5-${i}`] = nightIcons[i - 1];
      icons[`6-${i}`] = nightIcons[i - 1];
      icons[`7-${i}`] = nightIcons[i - 1];
    }
  
    return icons;
};
  
const weatherIcons = generateWeatherIcons();
  
const getWeatherConditions = (weather: number, daynight: number): JSX.Element | null => {
    const key = `${daynight}-${weather}`;
    return weatherIcons[key] || null;
};

export default getWeatherConditions;
