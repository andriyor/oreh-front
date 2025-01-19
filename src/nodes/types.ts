import type { Node, BuiltInNode } from '@xyflow/react';

export type PositionLoggerNode = Node<{ label: string }, 'position-logger'>;
export type TextNode = Node<{ label: string, time: number }, 'text-node'>;
export type AppNode = BuiltInNode | PositionLoggerNode | TextNode;
