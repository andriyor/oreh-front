import { useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
  useReactFlow,
  Position,
  Edge,
  getOutgoers,
  FinalConnectionState,
  Connection,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import "@xyflow/react/dist/style.css";

import {
  ChartData,
  Graph,
  GrapNode,
  nodeTypes,
} from "../../tree/components/types";
import { GraphApi } from "../../../api";
import { edgeTypes } from "../../tree/components/edges";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 450;
const nodeHeight = 36;

const getLayoutedElements = (
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

let id = 1;
const getId = () => `${id++}`;

const getOutgoersNested = (
  node: GrapNode,
  nodes: GrapNode[],
  edges: Edge[],
): GrapNode[] => {
  const out = getOutgoers(node, nodes, edges);
  return [...out, ...out.flatMap((n) => getOutgoersNested(n, nodes, edges))];
};

export const GraphFlow = (props: {
  runningNodeid: string;
  onShowChart: (data: ChartData[]) => void;
}) => {
  const queryClient = useQueryClient();
  const [nodes, setNodes, onNodesChange] = useNodesState<GrapNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const { data: graph, refetch: refetchGraph } = useQuery<Graph>({
    queryKey: ["graph"],
    queryFn: async () => {
      return await GraphApi.url("/graph").get().json();
    },
  });

  useEffect(() => {
    if (graph) {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(
          graph.nodes.map((node: GrapNode) => {
            return {
              ...node,
              type: "text-node",
            };
          }),
          graph.edges,
          "LR",
        );
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [graph]);

  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: ConnectionLineType.SmoothStep, animated: true },
          eds,
        ),
      ),
    [],
  );

  const nodeDeleteMutation = useMutation({
    mutationFn: async (nodes: GrapNode[]) => {
      const firstNode = nodes[0];
      return await GraphApi.url(`/node/${firstNode.id}`).delete().res();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entry"] });
      // fetchGraph();
    },
  });

  const showChart = (node: GrapNode) => {
    const out = getOutgoers(node, nodes, edges);
    const chartData: ChartData[] = out.map((n) => {
      return {
        x: n.data.label || "",
        y: n.data.totalTimeEntriersDuration,
      };
    });
    props.onShowChart(chartData);
  };

  const hidden = useRef<string[]>([]);
  const isCollapsed = useRef<string[]>([]);

  const toggleExpand = (node: GrapNode) => {
    const outgoerNodes = getOutgoersNested(node, nodes, edges);

    const outgoerNodeIds = outgoerNodes.map((n) => n.id);
    // filter in case click on same node
    const withoutAlreadyHidden = outgoerNodeIds.filter(
      (id) => !hidden.current.includes(id),
    );

    // filter already hidden in other three
    const withoutHiddenIds = hidden.current.filter(
      (id) => !outgoerNodeIds.includes(id),
    );

    hidden.current = [...withoutHiddenIds, ...withoutAlreadyHidden];

    if (isCollapsed.current.includes(node.id)) {
      isCollapsed.current = [
        ...isCollapsed.current.filter((nodeId) => nodeId !== node.id),
      ];
    } else {
      isCollapsed.current = [...isCollapsed.current, node.id];
    }

    setNodes((nds) =>
      nds.map((node) => {
        return {
          ...node,
          data: {
            ...node.data,
            isCollapsed: isCollapsed.current.includes(node.id),
          },
          hidden: hidden.current.includes(node.id),
        };
      }),
    );
  };

  const augmentedNodes = nodes.map((node) => {
    return {
      ...node,
      data: {
        ...node.data,
        toggleExpand,
        showChart,
      },
    };
  });

  const onConnectEnd = useCallback(
    (event, connectionState: FinalConnectionState) => {
      console.log("connectionState", connectionState);
      // when a connection is dropped on the pane it's not valid
      if (!connectionState.isValid) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = getId();
        const { clientX, clientY } =
          "changedTouches" in event ? event.changedTouches[0] : event;
        const newNode = {
          id,
          position: screenToFlowPosition({
            x: clientX + 100,
            y: clientY,
          }),
          type: "text-node",
          targetPosition: Position.Left,
          sourcePosition: Position.Right,
          data: { label: `Node ${id}` },
        };

        GraphApi.url(`/node/${connectionState.fromNode.id}`)
          .post()
          .res(() => {
            refetchGraph();
          });

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({ id, source: connectionState.fromNode.id, target: id }),
        );
      }

      if (
        connectionState.isValid &&
        connectionState.fromNode?.sourcePosition === "right" &&
        connectionState.toNode
      ) {
        const targetId = connectionState.fromNode.id;
        const sourceId = connectionState.toNode.id;
        GraphApi.url("/node/cgange")
          .post({
            targetId,
            sourceId,
          })
          .res(() => {
            refetchGraph();
          });
      }
    },
    [screenToFlowPosition],
  );

  return (
    <ReactFlow
      nodes={augmentedNodes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      edges={edges}
      edgeTypes={edgeTypes}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodesDelete={nodeDeleteMutation.mutate}
      onConnectEnd={onConnectEnd}
      fitView
    >
      <Background />
      <MiniMap />
      <Controls />
    </ReactFlow>
  );
};
