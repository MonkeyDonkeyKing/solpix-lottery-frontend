import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./TimeBox.module.css";
import { useState, useEffect } from "react";

interface TimeBoxProps {
  isoProp: string | null; // Updated to accept the new input format
}

const TimeBox = ({ isoProp }: TimeBoxProps) => {
  const [ended, setEnded] = useState(false);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (isoProp) {
      const interval = setInterval(() => {
        const targetTimestamp = parseInt(isoProp, 16) * 1000; // Convert hex to milliseconds
        const now = Date.now();
        const remainingTime = Math.max(0, targetTimestamp - now);

        if (remainingTime === 0) {
          setEnded(true);
          clearInterval(interval);
        } else {
          setEnded(false);

          const newDays = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
          const newHours = Math.floor(
            (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const newMinutes = Math.floor(
            (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
          );
          const newSeconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

          setDays(newDays);
          setHours(newHours);
          setMinutes(newMinutes);
          setSeconds(newSeconds);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isoProp]);

  if (ended) {
    return <div className={styles.timebox}><p style={{ textTransform: "uppercase" }}>Ended</p></div>;
  }

  return (
    <div className={styles.timebox}>
      <FontAwesomeIcon icon={faClock} />
      <div>
        <div>{days}</div>
        <span style={{ textTransform: "uppercase" }}>days</span>
      </div>
      <div>
        <div>{hours}</div>
        <span style={{ textTransform: "uppercase" }}>hrs</span>
      </div>
      <div>
        <div>{minutes}</div>
        <span style={{ textTransform: "uppercase" }}>mins</span>
      </div>
      <div>
        <div>{seconds}</div>
        <span style={{ textTransform: "uppercase" }}>secs</span>
      </div>
    </div>
  );
};

export default TimeBox;
