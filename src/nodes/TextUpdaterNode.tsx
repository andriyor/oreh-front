import { useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import { TimerApp } from "./Timer";

const handleStyle = { left: 10 };

export function TextUpdaterNode(data) {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  const handleStop = (time: number) => {
    console.log('handleStop', data.data.parentId, time)
    data.data.updateParent(data.data.parentId, {time})
  }

  return (
    <div style={{ padding: "10px", border: "solid" }}>
      <Handle type="target" position={Position.Left} />
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: "10px" }}>
          <input
            id="checkbox"
            type="checkbox"
            name="checkbox"
            onChange={onChange}
            className="nodrag"
          />
        </div>
        <div style={{ marginRight: "10px" }}>
          <input id="text" name="text" onChange={onChange} className="nodrag" />
        </div>
        <div>
          <TimerApp initialTime={data.data.time} onStop={handleStop}/>
        </div>
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
}
