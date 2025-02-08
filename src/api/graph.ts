import { useQuery } from "@tanstack/react-query";

import { GraphApi } from "./index";
import { Graph } from "../features/graph/components/types";

export const useGraph = () => {
  return useQuery<Graph>({
    queryKey: ["graph"],
    queryFn: async () => {
      return await GraphApi.url("/graph").get().json();
    },
  });
};
