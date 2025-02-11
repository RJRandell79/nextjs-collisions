'use client';

import { BsLightbulb, BsLightbulbFill, BsLightbulbOff } from "react-icons/bs";

const dayNightIcons: { [key: string]: JSX.Element } = {
  '4': <BsLightbulb className="mr-2 mb-2 text-xl" />,
  '5': <BsLightbulbFill className="mr-2 mb-2 text-xl" />,
  '6': <BsLightbulbOff className="mr-2 mb-2 text-xl" />
};

const getDayNight = (daynight: number): JSX.Element | null => {
    const key = `${daynight}`;
    return dayNightIcons[key] || null;
};

export default getDayNight;