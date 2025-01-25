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
  node: BaseNode;
};

export type EntryDatesWithNode = {
  duration: number;
  startTime: Date;
  stopTime: Date;
};

export type NodeData = {
  label?: string;
  time?: number;
  entry: Entry;
  hightlight?: boolean;
  isRunning?: boolean;
  commulativeDuration: number;
  totalTimeEntriersDuration: number;
  addTimeEntryToNode: (time: EntryToCreate) => void;
  updateNodeData: (nodeId: string, nodeData: NodeData) => void;
};


export type TextNode = Node<NodeData, "text-node">;
export type AppNode = TextNode;
