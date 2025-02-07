import type { Node, Position, NodeTypes, NodeProps } from "@xyflow/react";

import { TextUpdaterNode } from "./TextUpdaterNode";

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

export type NodeDataDb = {
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
  targetPosition: Position;
  sourcePosition: Position;
  position: {
    x: number;
    y: number;
  };
};

export type GrapNode = NodePosition & {
  id: string;
  data: NodeDataDb;
};

export type NodeData = NodeDataDb & {
  // runtime properties
  hightlight?: boolean;
  isCollapsed?: boolean;
  isRunning?: boolean;
  addTimeEntryToNode: (time: EntryToCreate) => void;
  toggleExpand: (nodeId: NodeProps<TextNode>) => void;
  showChart: (nodeId: NodeProps<TextNode>) => void;
  updateNodeData: (nodeData: NodeDataToUpdate) => void;
};

export type NodeDataToUpdate = NodeData & {
  nodeIdToUpdate: string;
};

export type Edge = {
  id: string;
  source: string;
  target: string;
};

export type TextNode = Node<NodeData, "text-node">;
export type AppNode = TextNode;

export type Graph = {
  edges: Edge[];
  nodes: GrapNode[];
};


export const nodeTypes = {
  "text-node": TextUpdaterNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes;
