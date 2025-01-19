import { type NodeTypes } from "@xyflow/react";

import { PositionLoggerNode } from "./PositionLoggerNode";
import { TextUpdaterNode } from "./TextUpdaterNode";
import { AppNode } from "./types";

const position = { x: 0, y: 0 };

export const initialNodes: AppNode[] = [
  { id: "a", position, type: "text-node", data: { label: "wire" } },
  {
    id: "b",
    type: "text-node",
    position,
    data: { label: "drag me!", time: 56 },
  },
  {
    id: "c",
    type: "text-node",
    position,
    data: { label: "your ideas" },
  },
  {
    id: "d",
    position,
    type: "text-node",
    data: { label: "with React Flow" },
  },
];

// export const initialNodes: AppNode[] = [
//   { id: "6302ef00-980e-4496-8fab-c6d7f898c5c8", data: { label: "your ideas" } },
//   { id: "263755b0-df85-4694-9c29-e3858ed81f46", data: { label: "node 2" } },
// ];

export const nodeTypes = {
  "position-logger": PositionLoggerNode,
  "text-node": TextUpdaterNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes;
