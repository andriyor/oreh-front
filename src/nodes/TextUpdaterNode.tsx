import { useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import { TimerApp } from "./Timer";

export function TextUpdaterNode(data) {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);
  

  const handleStop = (time: { time: number; startTime: string; stopTime: string }) => {
    console.log('data.data', data)
    data.data.updateParent(data.data.parentId, {time})
    console.log('handleStop', data.data.parentId, time)
    fetch('http://localhost:3000/entry', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "duration": time.time,
        "startTime": time.startTime,
        "stopTime": time.stopTime,
        "nodeId": data.id
      })
    })
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
          <TimerApp duration={data.data.duration} onStop={handleStop}/>
        </div>
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
}
