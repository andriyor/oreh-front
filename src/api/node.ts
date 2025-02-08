import { useQuery } from "@tanstack/react-query";

import { GraphApi } from "./index";
import { GrapNode } from "../features/tree/components/types";

export const useNodes = (range: { from: string; to: string }) => {
  return useQuery<GrapNode[]>({
    queryFn: async () => {
      return await GraphApi.url("/node").query(range).get().json();
    },
    queryKey: ["node"],
  });
};
