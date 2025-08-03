import { FloatingFocusManager } from "@floating-ui/react";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { useCallback, useState } from "react";

import { Timer, TimerApp } from "./Timer";
import { TextNode } from "./types";

import { useEntryMutation } from "../../../api/entry";
import { useNodeDataMutation } from "../../../api/node";
import { debounce } from "../../../helpers";
import { useFloatingUI } from "../../../hooks/use-floating";

import CalendarIcon from "../../../icons/calendar.svg";
import MinusIcon from "../../../icons/minus-solid.svg";
import PlusIcon from "../../../icons/plus-solid.svg";
import RecurringIcon from "../../../icons/refresh.svg";
import { useTimerStore } from "../../../store";

export type TimeEntry = {
  time: number;
  startTime: string;
  stopTime: string;
};

export function TextUpdaterNode(props: NodeProps<TextNode>) {
  const runningNode = useTimerStore((state) => state.runningNode);
  const [nodeLabel, setNodeLabel] = useState(props.data.label || "");
  const nodeDataMutation = useNodeDataMutation();
  const entryMutation = useEntryMutation();
  const selectedNodeId = useTimerStore((state) => state.selectedNodeId);
  const [isCallendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarValue, setCalendarValue] = useState<Date>(new Date());

  const handleDebouncedChange = useCallback(
    debounce((value: string) => {
      nodeDataMutation.mutate({
        id: props.id,
        data: {
          ...props.data,
          label: value,
        },
      });
    }, 500),
    [],
  );

  const handleNodeLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setNodeLabel(newValue);
    handleDebouncedChange(newValue);
  };

  const handleStop = (time: Timer) => {
    entryMutation.mutate({ ...time, nodeId: props.id });
  };

  const onCheckboxChange = (value: boolean) => {
    nodeDataMutation.mutate({
      id: props.id,
      parentId: props.data.parentId,
      isCompleted: value,
      isRecurring: props.data.isRecurring,
      data: { ...props.data, isChecked: value, doneAt: value ? new Date() : null },
    });
  };

  const { refs, floatingStyles, getReferenceProps, getFloatingProps, context } = useFloatingUI({
    isOpen: isCallendarOpen,
    onOpenChange: setIsCalendarOpen,
  });

  const handleDueDateChange = (date: Date) => {
    setCalendarValue(date);
    nodeDataMutation.mutate({
      id: props.id,
      dueDate: date,
    });
  };

  const handleDaily = () => {
    nodeDataMutation.mutate({
      id: props.id,
      dueDate: new Date(),
      recurrenceType: "daily",
      isRecurring: true,
    });
  };

  return (
    <div
      style={{
        padding: "10px",
        border: "solid",
        borderBlockColor: selectedNodeId === props.id || runningNode?.id === props.id ? "red" : "black",
      }}
    >
      <Handle type="target" position={Position.Left} />
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: "10px" }}>
          <input
            id="checkbox"
            type="checkbox"
            name="checkbox"
            defaultChecked={props.data.isCompleted}
            className="nodrag"
            onChange={(e) => onCheckboxChange(e.target.checked)}
          />
        </div>
        <div style={{ marginRight: "10px" }}>
          <input id="text" name="text" value={nodeLabel} onChange={handleNodeLabelChange} className="nodrag" />
        </div>
        <div>
          <TimerApp node={props} duration={props.data.commulativeDuration} onStop={handleStop} />
        </div>

        {/* <div className="mr-3">
          <button onClick={() => props.data.showChart(props)}>
            <img src={StatsIcon} height="15px" />
          </button>
        </div> */}

        {props.data.isRecurring && (
          <div className="mr-3">
            <img src={RecurringIcon} height="15px" />
          </div>
        )}

        <div className="mr-3" {...getReferenceProps()}>
          <button onClick={() => {}}>
            <img src={CalendarIcon} height="15px" />
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

      {isCallendarOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            className="rounded-lg shadow-xl p-4"
            ref={refs.setFloating}
            style={{ ...floatingStyles, backgroundColor: "white" }}
            {...getFloatingProps()}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateCalendar value={calendarValue} onChange={handleDueDateChange} />
            </LocalizationProvider>
            <button onClick={handleDaily}>every day</button>
          </div>
        </FloatingFocusManager>
      )}
    </div>
  );
}
