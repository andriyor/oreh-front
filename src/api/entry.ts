import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "usehooks-ts";

import {
  Entry,
  EntryDatesWithNode,
  EntryToCreate,
  EntryWithNode,
} from "../features/tree/components/types";
import { GraphApi } from "./index";

export const useEntryMutation = () => {
  const queryClient = useQueryClient();
  const [checkboxState] = useLocalStorage("tags-state", {});

  return useMutation({
    mutationFn: async (entry: EntryToCreate) => {
      return await GraphApi.url("/entry")
        .post({
          nodeId: entry.nodeId,
          duration: entry.duration,
          startTime: entry.startTime,
          stopTime: entry.stopTime,
          data: checkboxState,
        })
        .json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["entry"], (old: Entry[]) => [data, ...old]);
      queryClient.invalidateQueries({ queryKey: ["graph"] });
    },
  });
};

export const useEntryDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await GraphApi.url(`/entry/${id}`).delete().res();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entry"] });
    },
  });
};

export const useEntries = () => {
  return useQuery<EntryWithNode[]>({
    queryKey: ["entry"],
    queryFn: async () => {
      return await GraphApi.url("/entry").get().json();
    },
  });
};

export const useUpdateEntryMutation = (entryId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: EntryDatesWithNode) => {
      return await GraphApi.url(`/entry/${entryId}`)
        .put(entry)
        .json<EntryWithNode>();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entry"] });
    },
  });
};
