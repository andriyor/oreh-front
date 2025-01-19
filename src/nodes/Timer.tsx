import { useEffect, useState } from "react";

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
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer); // Cleanup on component unmount or when isRunning changes
  }, [isRunning]);

  const togglTimer = () => {
    if (isRunning) {
      onStop({
        time: timeElapsed,
        startTime: startTime,
        stopTime: new Date().toISOString(),
      });
      setTotalTime(timeElapsed + totalTime);
      setTimeElapsed(0);
    }

    if (!isRunning) {
      setStartTime(new Date().toISOString());
    }

    setIsRunning(!isRunning);
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ marginRight: "10px" }}>
        <button onClick={togglTimer}>
          {isRunning ? "Stop Timer" : "Start timer"}
        </button>
      </div>
      <div style={{ marginRight: "5px" }}>T: {totalTime}</div>
      <div>C: {timeElapsed}</div>
    </div>
  );
};
