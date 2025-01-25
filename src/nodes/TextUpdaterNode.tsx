import { useCallback, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Timer, TimerApp } from "./Timer";
import { TextNode } from "./types";

export type TimeEntry = {
  time: number;
  startTime: string;
  stopTime: string;
};

function debounce(func: Function, delay: number) {
  let timeout: number;
  return (...args: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

export function TextUpdaterNode(data: TextNode) {
  const [inputValue, setInputValue] = useState(data.data.label || "");

  const handleDebouncedChange = useCallback(
    debounce((value: string) => {
      data.data.updateNodeData(data.id, {
        ...data.data,
        label: value,
      });
    }, 500),
    []
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    handleDebouncedChange(newValue);
  };

  const handleStop = (time: Timer) => {
    data.data.addTimeEntryToNode({...time, nodeId: data.id });
  };

  return (
    <div
      style={{
        padding: "10px",
        border: "solid",
        borderBlockColor: data.data.hightlight ? "red" : "black",
      }}
    >
      <Handle type="target" position={Position.Left} />
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: "10px" }}>
          <input
            id="checkbox"
            type="checkbox"
            name="checkbox"
            className="nodrag"
          />
        </div>
        <div style={{ marginRight: "10px" }}>
          <input
            id="text"
            name="text"
            value={inputValue}
            onChange={handleChange}
            className="nodrag"
          />
        </div>
        <div>
          <TimerApp
            isRunning={data.data.isRunning}
            duration={data.data.commulativeDuration}
            onStop={handleStop}
          />
        </div>
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
}
