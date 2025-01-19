import { type NodeTypes } from "@xyflow/react";

import { PositionLoggerNode } from "./PositionLoggerNode";
import { TextUpdaterNode } from "./TextUpdaterNode";
import { AppNode } from "./types";

const position = { x: 0, y: 0 };

export const initialNodes: AppNode[] = [
  { id: "a", position, type: "input", data: { label: "wire" } },
  {
    id: "b",
    type: "text-node",
    position,
    data: { label: "drag me!" , time: 56},
  },
  {
    id: "c",
    position,
    data: { label: "your ideas" },
  },
  {
    id: "d",
    position,
    data: { label: "with React Flow" },
  },
];

export const nodeTypes = {
  "position-logger": PositionLoggerNode,
  "text-node": TextUpdaterNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes;
