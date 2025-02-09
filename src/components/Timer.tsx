import { useEffect, useState } from "react";

import { useTimerStore } from "../store";
import Stop from "../icons/stop-solid.svg";
import { formatSeconds } from "../helpers";
import { useEntryMutation } from "../api/entry";

export const TopTimer = () => {
  const runningNode = useTimerStore((state) => state.runningNode);
  const setRunningNode = useTimerStore((state) => state.setRunningNode);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const entryMutation = useEntryMutation();

  useEffect(() => {
    let timer: number;
    if (runningNode) {
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [runningNode]);

  const stopTimer = () => {
    entryMutation.mutate({
      nodeId: runningNode!.id,
      duration: timeElapsed,
      startTime: runningNode!.startTime,
      stopTime: new Date().toISOString(),
    });
    setRunningNode(undefined);
  };

  return (
    <div className="flex p-3">
      {runningNode ? (
        <>
          <div className="mr-3">{runningNode.label}</div>
          <div className="flex  ml-auto">
            <div className="mr-3">{formatSeconds(timeElapsed)}</div>
            <div>
              <button onClick={stopTimer}>
                <img src={Stop} height="15px" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div>No currently running timer</div>
      )}
    </div>
  );
};
