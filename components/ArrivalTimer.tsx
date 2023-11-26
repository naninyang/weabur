import { useEffect, useState } from 'react';

const ArrivalTimer = ({ initialArrtime }: { initialArrtime: number }) => {
  const [arrtime, setArrtime] = useState(initialArrtime);

  useEffect(() => {
    const countTimer = setInterval(() => {
      setArrtime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(countTimer);
  }, []);

  const formatArrivalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}시간 ${minutes}분 ${remainingSeconds}초 남음`;
    } else if (minutes > 0) {
      return `${minutes}분 ${remainingSeconds}초 남음`;
    } else if (remainingSeconds > 0) {
      return `${remainingSeconds}초 남음`;
    } else {
      return <strong>지나감</strong>;
    }
  };

  return formatArrivalTime(arrtime);
};

export default ArrivalTimer;
