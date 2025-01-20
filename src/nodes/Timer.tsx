import { useEffect, useState } from "react";

import Stop from "../icons/stop-solid.svg";
import Play from "../icons/play-solid.svg";

export const TimerApp = ({
  duration,
  onStop,
}: {
  duration?: number;
  onStop: (time: { time: number; startTime: string; stopTime: string }) => void;
}) => {
  const [totalTime, setTotalTime] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState("");

  useEffect(() => {
    setTotalTime(duration || 0);
  }, [duration]);

  useEffect(() => {
    let timer: number;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer); // Cleanup on component unmount or when isRunning changes
  }, [isRunning]);

  const stopTimer = () => {
    onStop({
      time: timeElapsed,
      startTime: startTime,
      stopTime: new Date().toISOString(),
    });
    setTotalTime(timeElapsed + totalTime);
    setTimeElapsed(0);
    setIsRunning(false);
  };

  const startTimer = () => {
    setStartTime(new Date().toISOString());
    setIsRunning(true);
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ marginRight: "10px" }}>
        {isRunning ? (
          <button onClick={stopTimer}>
            <img src={Stop} height="15px"/>
          </button>
        ) : (
          <button onClick={startTimer}>
            <img src={Play} height="15px"/>
          </button>
        )}
      </div>
      <div className="mr-2">T: {totalTime}</div>
      {isRunning && <div>C: {timeElapsed}</div>}
    </div>
  );
};
