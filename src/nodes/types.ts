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
  // stored properties
  label?: string;
  time?: number;
  entry: Entry;
  isChecked?: boolean;
  // not stored properties
  commulativeDuration: number;
  totalTimeEntriersDuration: number;
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
  nodeIdToUpdate: string
}


export type TextNode = Node<NodeData, "text-node">;
export type AppNode = TextNode;
