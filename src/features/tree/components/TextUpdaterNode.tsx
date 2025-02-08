import { useCallback, useState } from "react";
import { Handle, NodeProps, Position } from "@xyflow/react";

import { TextNode } from "./types";
import { Timer, TimerApp } from "./Timer";

import DotsIcon from "../../../icons/ellipsis-v-solid.svg";
import MinusIcon from "../../../icons/minus-solid.svg";
import PlusIcon from "../../../icons/plus-solid.svg";
import { useTimerStore } from "../../../store";
import { useNodeDataMutation } from "../../../api/node";
import { useEntryMutation } from "../../../api/entry";

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

export function TextUpdaterNode(props: NodeProps<TextNode>) {
  const runningNode = useTimerStore((state) => state.runningNode);
  const [inputValue, setInputValue] = useState(props.data.label || "");
  const nodeDataMutation = useNodeDataMutation();
  const entryMutation = useEntryMutation();
  const selectedNodeId = useTimerStore((state) => state.selectedNodeId);

  const handleDebouncedChange = useCallback(
    debounce((value: string) => {
      nodeDataMutation.mutate({
        nodeIdToUpdate: props.id,
        ...props.data,
        label: value,
      });
    }, 500),
    [],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    handleDebouncedChange(newValue);
  };

  const handleStop = (time: Timer) => {
    entryMutation.mutate({ ...time, nodeId: props.id });
  };

  const onCheckboxChange = (value: boolean) => {
    nodeDataMutation.mutate({
      nodeIdToUpdate: props.id,
      ...props.data,
      isChecked: value,
      doneAt: value ? new Date() : null,
    });
  };

  return (
    <div
      style={{
        padding: "10px",
        border: "solid",
        borderBlockColor:
          selectedNodeId === props.id || runningNode?.id === props.id
            ? "red"
            : "black",
      }}
    >
      <Handle type="target" position={Position.Left} />
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: "10px" }}>
          <input
            id="checkbox"
            type="checkbox"
            name="checkbox"
            defaultChecked={props.data.isChecked}
            className="nodrag"
            onChange={(e) => onCheckboxChange(e.target.checked)}
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
            node={props}
            duration={props.data.commulativeDuration}
            onStop={handleStop}
          />
        </div>

        <div className="mr-3">
          <button onClick={() => props.data.showChart(props)}>
            <img src={DotsIcon} height="15px" />
          </button>
        </div>

        {props.data.isCollapsed ? (
          <button onClick={() => props.data.toggleExpand(props)}>
            <img src={PlusIcon} height="15px" />
          </button>
        ) : (
          <button onClick={() => props.data.toggleExpand(props)}>
            <img src={MinusIcon} height="15px" />
          </button>
        )}
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
}
