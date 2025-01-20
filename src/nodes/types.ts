import type { Node, BuiltInNode } from "@xyflow/react";
import { TimeEntry } from "./TextUpdaterNode";

type Entry = {
  id: string;
  duration: number;
  startTime: string;
  stopTime: string;
  nodeId: string;
};

export type NodeData = {
  label?: string;
  time?: number;
  entry: Entry;
  parentId: string;
  commulativeDuration: number;
  totalTimeEntriersDuration: number;
  addTimeEntryToNode: (nodeId: string, time: TimeEntry) => void;
  updateNodeData: (nodeId: string, nodeData: NodeData) => void;
};

export type PositionLoggerNode = Node<{ label: string }, "position-logger">;
export type TextNode = Node<NodeData, "text-node">;
export type AppNode = BuiltInNode | PositionLoggerNode | TextNode;
