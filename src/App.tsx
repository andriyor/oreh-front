import { useCallback, useEffect, useRef, useState } from "react";
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
  ReactFlowProvider,
  Position,
  Edge,
  getOutgoers,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "@xyflow/react/dist/style.css";

import { nodeTypes } from "./nodes";
import { edgeTypes } from "./edges";

import {
  AppNode,
  Entry,
  EntryToCreate,
  NodeDataToUpdate,
  TextNode,
} from "./nodes/types";
import { EntryList } from "./components/entry/EntryList";
import { useMediaQuery } from "usehooks-ts";
import { GraphApi } from "./api";
import { VictoryPie, VictoryTheme } from "victory";
import { TagList } from "./components/tags/Tags";
import { TagValues } from "./components/tags/TagVlues";
import { ChartByTags } from "./components/tags/TagChart";
import { HeatMap } from "./components/HeatMap";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 450;
const nodeHeight = 36;

const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
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
  node: TextNode,
  nodes: TextNode[],
  edges: Edge[],
): TextNode[] => {
  const out = getOutgoers(node, nodes, edges);
  return [...out, ...out.flatMap((n) => getOutgoersNested(n, nodes, edges))];
};

const AddNodeOnEdgeDrop = (props: {
  currentNodeId: string;
  runningNodeid: string;
  checkboxState: unknown;
  onShowChart: (data: ChartData[]) => void;
}) => {
  const queryClient = useQueryClient();
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const fetchGraph = () => {
    GraphApi.url("/graph")
      .get()
      .json((json) => {
        const { nodes: layoutedNodes, edges: layoutedEdges } =
          getLayoutedElements(
            json.nodes.map((node) => {
              return {
                ...node,
                type: "text-node",
              };
            }),
            json.edges,
            "LR",
          );
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
      });
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        return {
          ...node,
          data: {
            ...node.data,
            hightlight: node.id === props.currentNodeId,
            isRunning: node.id === props.runningNodeid,
          },
        };
      }),
    );
  }, [props.currentNodeId]);

  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: ConnectionLineType.SmoothStep, animated: true },
          eds,
        ),
      ),
    [],
  );

  const nodeDeleteMutation = useMutation({
    mutationFn: async (nodes: AppNode[]) => {
      const firstNode = nodes[0];
      return await GraphApi.url(`/node/${firstNode.id}`).delete().res();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entry"] });
      // fetchGraph();
    },
  });

  const updateNodeDataMutation = useMutation({
    mutationFn: async (nodeData: NodeDataToUpdate) => {
      const { label, isChecked } = nodeData;
      return await GraphApi.url(`/node/${nodeData.nodeIdToUpdate}`)
        .patch({
          label,
          isChecked,
        })
        .json();
    },
    onSuccess: () => {
      // TODO: update only label changed
      queryClient.invalidateQueries({ queryKey: ["entry"] });
      // fetchGraph();
    },
  });

  const entryMutation = useMutation({
    mutationFn: async (entry: EntryToCreate) => {
      return await GraphApi.url("/entry")
        .post({
          nodeId: entry.nodeId,
          duration: entry.duration,
          startTime: entry.startTime,
          stopTime: entry.stopTime,
          data: props.checkboxState,
        })
        .json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["entry"], (old: Entry[]) => [data, ...old]);
      fetchGraph();
    },
  });

  const showChart = (node: TextNode) => {
    const out = getOutgoers(node, nodes, edges);
    console.log("out", out);
    const chartData: ChartData[] = out.map((n) => {
      return {
        x: n.data.label || "",
        y: n.data.totalTimeEntriersDuration,
      };
    });
    console.log("chartData", chartData);
    props.onShowChart(chartData);
  };

  const hidden = useRef<string[]>([]);
  const isCollapsed = useRef<string[]>([]);

  const toggleExpand = (node: TextNode) => {
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
        updateNodeData: updateNodeDataMutation.mutate,
        toggleExpand,
        showChart,
        addTimeEntryToNode: entryMutation.mutate,
      },
    };
  });

  const onConnectEnd = useCallback(
    (event, connectionState) => {
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
            fetchGraph();
          });

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({ id, source: connectionState.fromNode.id, target: id }),
        );
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

type ChartData = {
  x: string;
  y: number;
};

const Wrapper = () => {
  console.log("Wrapper");
  const [nodeid, setNodeId] = useState("");
  const [runningNodeid, setRunningNodeId] = useState("");
  const matches = useMediaQuery("(min-width: 1300px)");
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [checkboxState, setCheckboxState] = useState<unknown>({});

  return (
    <div style={{ height: "100%", display: matches ? "flex" : "block" }}>
      <div style={{ height: "60%", width: matches ? "50%" : "98%" }}>
        <ReactFlowProvider>
          <AddNodeOnEdgeDrop
            currentNodeId={nodeid}
            checkboxState={checkboxState}
            onShowChart={(chart) => setChartData(chart)}
            runningNodeid={runningNodeid}
          />
        </ReactFlowProvider>
      </div>

      <div className="flex m-5" style={{ width: matches ? "50%" : "98%" }}>
        <div>
          Current tags startTime:
          <div className="m-5">
            <TagList />
          </div>
          <div className="m-5">
            <TagValues
              entryTags={{}}
              onChange={(state) => setCheckboxState(state)}
            />
          </div>
          <div>
            <ChartByTags />
          </div>
        </div>
        {Boolean(chartData.length) && (
          <div style={{ height: "350px" }}>
            <VictoryPie data={chartData} theme={VictoryTheme.clean} />
          </div>
        )}

        <div className="flex-1">
          <EntryList
            onClick={(id) => setNodeId(id)}
            onStartTimer={(id) => setRunningNodeId(id)}
          />
        </div>
      </div>
      <div className="m-5">
        <HeatMap />
      </div>
    </div>
  );
};

const queryClient = new QueryClient();

export default () => (
  <QueryClientProvider client={queryClient}>
    <Wrapper />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
