import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { GraphApi } from "./index";
import { GrapNode, NodeDataToUpdate } from "../features/graph/components/types";

export const useNodes = (range: { from: string; to: string }) => {
  return useQuery<GrapNode[]>({
    queryFn: async () => {
      return await GraphApi.url("/node").query(range).get().json();
    },
    queryKey: ["node", range],
  });
};

export const useNodeDataMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (nodeData: NodeDataToUpdate) => {
      const { label, isChecked, doneAt } = nodeData;
      return await GraphApi.url(`/node/${nodeData.nodeIdToUpdate}`)
        .patch({
          label,
          isChecked,
          doneAt,
        })
        .json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["node"] });
      // TODO: invalidate only for label changes and not checkbox
      queryClient.invalidateQueries({ queryKey: ["entry"] });
      // fetchGraph();
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
