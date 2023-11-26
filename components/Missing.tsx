import { useEffect, useState } from 'react';
import styles from '@/styles/home.module.sass';

const Missing = ({ ArrTime }: { ArrTime: number }) => {
  const [missingTime, setMissingTime] = useState(ArrTime);

  useEffect(() => {
    if (missingTime <= 0) return;
    const timerId = setInterval(() => {
      setMissingTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timerId);
  }, [missingTime]);
  return missingTime === 0 && <div className={styles.missing} />;
};

export default Missing;
