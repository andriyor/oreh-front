import { useEffect, useState } from "react";

import Stop from "../icons/stop-solid.svg";
import Play from "../icons/play-solid.svg";
import { formatSeconds } from "../helpers";

export type Timer = {
  duration: number;
  startTime: string;
  stopTime: string;
};

export const TimerApp = (props: {
  isRunning?: boolean;
  duration?: number;
  onStop: (time: Timer) => void;
}) => {
  const [totalTime, setTotalTime] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState("");

  useEffect(() => {
    setTotalTime(props.duration || 0);
  }, [props.duration]);

  useEffect(() => {
    let timer: number;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const stopTimer = () => {
    props.onStop({
      duration: timeElapsed,
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

  useEffect(() => {
    if (props.isRunning) {
      startTimer();
    }
  }, [props.isRunning]);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ marginRight: "10px" }}>
        {isRunning ? (
          <button onClick={stopTimer}>
            <img src={Stop} height="15px" />
          </button>
        ) : (
          <button onClick={startTimer}>
            <img src={Play} height="15px" />
          </button>
        )}
      </div>
      <div className="mr-2">{formatSeconds(totalTime)}</div>
      {isRunning && <div>C: {formatSeconds(timeElapsed)}</div>}
    </div>
  );
};
