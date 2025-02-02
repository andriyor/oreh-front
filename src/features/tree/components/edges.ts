import type { Edge, EdgeTypes } from "@xyflow/react";

export const initialEdges: Edge[] = [
  { id: 'a->b', source: 'a', target: 'b' },
  { id: 'a->c', source: 'a', target: 'c' },
  { id: 'a->d', source: 'a', target: 'd' },
];

// export const initialEdges: Edge[] = [
//   {
//     id: "923bd483-21fd-451a-840f-675ea8ad0f7c",
//     source: "6302ef00-980e-4496-8fab-c6d7f898c5c8",
//     target: "263755b0-df85-4694-9c29-e3858ed81f46",
//   },
// ];

export const edgeTypes = {
  // Add your custom edge types here!
} satisfies EdgeTypes;
