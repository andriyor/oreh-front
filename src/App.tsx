import { useCallback, useEffect, useState } from "react";
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
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { nodeTypes } from "./nodes";
import { edgeTypes } from "./edges";

import dagre from "@dagrejs/dagre";
import { AppNode, EntryToCreate, NodeData } from "./nodes/types";
import { EntryList } from "./components/EntryList";
import { QueryClient, QueryClientProvider, useMutation } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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

const AddNodeOnEdgeDrop = (props: {
  currentNodeId: string;
  runningNodeid: string;
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const fetchGraph = () => {
    fetch("http://localhost:3000/graph")
      .then((response) => response.json())
      .then((json) => {
        console.log("json", json);
        const { nodes: layoutedNodes, edges: layoutedEdges } =
          getLayoutedElements(
            json.nodes.map((node) => {
              return {
                ...node,
                type: "text-node",
              };
            }),
            json.edges,
            "LR"
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
      })
    );
  }, [props.currentNodeId]);

  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: ConnectionLineType.SmoothStep, animated: true },
          eds
        )
      ),
    []
  );

  const updateNodeData = (nodeId: string, nodeData: NodeData) => {
    const { label } = nodeData;
    fetch(`http://localhost:3000/node/${nodeId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        label,
      }),
    }).then(() => {});
  };

  const mutation = useMutation({
    mutationFn: (entry: EntryToCreate) => {
      return fetch("http://localhost:3000/entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nodeId: entry.nodeId,
          duration: entry.duration,
          startTime: entry.startTime,
          stopTime: entry.stopTime,
        }),
      })
    },
    onSuccess: () => {
      fetchGraph();
    },
  })

  const augmentedNodes = nodes.map((node) => {
    return {
      ...node,
      data: {
        ...node.data,
        updateNodeData,
        addTimeEntryToNode: mutation.mutate,
      },
    };
  });

  const onConnectEnd = useCallback(
    (event, connectionState) => {
      console.log("connectionState.fromNode", connectionState.fromNode);
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

        fetch(`http://localhost:3000/node/${connectionState.fromNode.id}`, {
          method: "POST",
        }).then(() => {
          fetchGraph();
        });

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({ id, source: connectionState.fromNode.id, target: id })
        );
      }
    },
    [screenToFlowPosition]
  );

  const onNodesDelete = (nodes: AppNode[]) => {
    nodes.forEach((node) => {
      fetch(`http://localhost:3000/node/${node.id}`, {
        method: "DELETE",
      });
    });
  };

  return (
    <ReactFlow
      nodes={augmentedNodes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      edges={edges}
      edgeTypes={edgeTypes}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodesDelete={onNodesDelete}
      onConnectEnd={onConnectEnd}
      fitView
    >
      <Background />
      <MiniMap />
      <Controls />
    </ReactFlow>
  );
};

const Wrapper = () => {
  const [nodeid, setNodeId] = useState("");
  const [runningNodeid, setRunningNodeId] = useState("");
  return (
    <div style={{ height: "100%" }}>
      <div style={{ height: "60%" }}>
        <ReactFlowProvider>
          <AddNodeOnEdgeDrop
            currentNodeId={nodeid}
            runningNodeid={runningNodeid}
          />
        </ReactFlowProvider>
      </div>
      <EntryList
        onClick={(id) => setNodeId(id)}
        onStartTimer={(id) => setRunningNodeId(id)}
      />
    </div>
  );
};

const queryClient = new QueryClient();

export default () => (
  <QueryClientProvider client={queryClient}>
    <Wrapper />;
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
