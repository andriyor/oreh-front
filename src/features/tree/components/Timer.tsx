import { NodeProps } from "@xyflow/react";

import Play from "../../../icons/play-solid.svg";
import { formatSeconds } from "../../../helpers";
import { useTimerStore } from "../../../store";
import { TextNode } from "./types";


export type Timer = {
  duration: number;
  startTime: string;
  stopTime: string;
};

export const TimerApp = (props: {
  node: NodeProps<TextNode>;
  duration?: number;
  onStop: (time: Timer) => void;
}) => {
  const setRunningNode = useTimerStore((state) => state.setRunningNode);

  const startTimer = () => {
    setRunningNode({
      id: props.node.id,
      startTime: new Date().toISOString(),
      label: props.node.data.label || "",
    });
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ marginRight: "10px" }}>
        <button onClick={startTimer}>
          <img src={Play} height="15px" />
        </button>
      </div>
      <div className="mr-2">{formatSeconds(props.duration || 0)}</div>
    </div>
  );
};
