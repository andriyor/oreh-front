import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { GrapNode, GrapNodeToUpdate } from "../features/graph/components/types";
import { GraphApi } from "./index";

export const useNodes = (range: { from: string; to: string }) => {
  return useQuery<GrapNode[]>({
    queryFn: async () => {
      return await GraphApi.url("/node").query(range).get().json();
    },
    queryKey: ["node", range],
  });
};

export const useAggregatedNodes = (range: { from: string; to: string }) => {
  return useQuery<GrapNode[]>({
    queryFn: async () => {
      return await GraphApi.url("/node/aggregated").query(range).get().json();
    },
    queryKey: ["node", range],
  });
};

export const usePlanned = () => {
  return useQuery<GrapNode[]>({
    queryKey: ["planned"],
    queryFn: async () => {
      return await GraphApi.url("/node/planned").get().json();
    },
  });
};

export const useNodeDataMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (nodeData: GrapNodeToUpdate) => {
      return await GraphApi.url(`/node/${nodeData.id}`)
        .patch({
          parentId: nodeData.parentId,
          dueDate: nodeData.dueDate,
          recurrenceType: nodeData.recurrenceType,
          isRecurring: nodeData.isRecurring,
          data: {
            label: nodeData.data?.label,
            isChecked: nodeData.data?.isChecked,
            doneAt: nodeData.data?.doneAt,
          },
        })
        .json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["node"] });
      // TODO: invalidate only for label changes and not checkbox
      queryClient.invalidateQueries({ queryKey: ["entry"] });
      // fetchGraph();
    },
    onError: (error) => {
      console.error("Error updating node data:", error);
    },
  });
};

export const useDeleteNodeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (nodes: GrapNode[]) => {
      const firstNode = nodes[0];
      return await GraphApi.url(`/node/${firstNode.id}`).delete().res();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entry"] });
      // fetchGraph();
    },
  });
};
