import type { Node } from "@xyflow/react";

export type EntryToCreate = {
  duration: number;
  startTime: string;
  stopTime: string;
  nodeId: string;
};

export type Entry = EntryToCreate & {
  id: string;
};

export type BaseNode = {
  id: string;
  data: {
    label: string;
  };
};

export type EntryWithNode = {
  id: string;
  duration: number;
  startTime: string;
  stopTime: string;
  data: Record<string, string>;
  node: BaseNode;
};

export type EntryDatesWithNode = {
  duration?: number;
  startTime?: Date;
  stopTime?: Date;
  data?: Record<string, string>;
};

export type NodeDb = {
  id: string;
  // stored properties
  label?: string;
  time?: number;
  entry: Entry;
  isChecked?: boolean;
  // not stored properties
  commulativeDuration: number;
  totalTimeEntriersDuration: number;
};

export type NodePosition = {
  // targetPosition: "left" | "top";
  targetPosition: string;
  // sourcePosition: "right" | "bottom";
  sourcePosition: string;
  position: {
    x: number;
    y: number;
  };
};

export type NodeWithPosition = NodeDb & NodePosition;

export type NodeData = NodeDb & {
  // runtime properties
  hightlight?: boolean;
  isCollapsed?: boolean;
  isRunning?: boolean;
  addTimeEntryToNode: (time: EntryToCreate) => void;
  toggleExpand: (nodeId: TextNode) => void;
  showChart: (nodeId: TextNode) => void;
  updateNodeData: (nodeData: NodeDataToUpdate) => void;
};

export type NodeDataToUpdate = NodeData & {
  nodeIdToUpdate: string;
};

export type Edge = {
  id: string;
  source: string;
};

export type TextNode = Node<NodeData, "text-node">;
export type AppNode = TextNode;

export type Graph = {
  edges: Edge[];
  nodes: NodeDb[];
};
