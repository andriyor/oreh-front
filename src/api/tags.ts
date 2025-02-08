import { useQuery } from "@tanstack/react-query";

import { GraphApi } from "./index";

export type Tags = {
  id: string;
  label: string;
  type: string;
};

export const useTags = () => {
  return useQuery<Tags[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      return await GraphApi.url("/tags").get().json();
    },
  });
}
