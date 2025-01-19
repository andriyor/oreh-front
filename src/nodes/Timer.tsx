import { useEffect, useState } from "react";

export const TimerApp = ({
  initialTime,
  onStop,
}: {
  initialTime?: number;
  onStop: (time: number) => void;
}) => {
  const [totalTime, setTotalTime] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setTotalTime(initialTime || 0);
  }, [initialTime]);

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
      onStop(timeElapsed);
      setTotalTime(timeElapsed + totalTime);
      setTimeElapsed(0);
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
