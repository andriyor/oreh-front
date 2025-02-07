import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "usehooks-ts";

import { Entry, EntryToCreate } from "../features/tree/components/types";
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
} 
