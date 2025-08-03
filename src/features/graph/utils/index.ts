import { getOutgoers, Edge, Position } from "@xyflow/react";
import dagre from "@dagrejs/dagre";

import { GrapNode } from "../components/types";

export const getOutgoersNested = (
  node: GrapNode,
  nodes: GrapNode[],
  edges: Edge[],
): GrapNode[] => {
  const out = getOutgoers(node, nodes, edges);
  return [...out, ...out.flatMap((n) => getOutgoersNested(n, nodes, edges))];
};

// [Dagre Tree - React Flow](https://reactflow.dev/examples/layout/dagre)

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 500;
const nodeHeight = 36;

export const getLayoutedElements = (
  nodes: GrapNode[],
  edges: Edge[],
  direction = "TB",
) => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes: GrapNode[] = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};
