import type { Node, BuiltInNode } from '@xyflow/react';

type Entry = {
  id: string;
  duration: number;
  startTime: string;
  stopTime: string;
  nodeId: string;
}

export type PositionLoggerNode = Node<{ label: string }, 'position-logger'>;
export type TextNode = Node<{ label: string, time?: number, entry: Entry }, 'text-node'>;
export type AppNode = BuiltInNode | PositionLoggerNode | TextNode;
