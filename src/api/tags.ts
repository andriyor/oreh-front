import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { GraphApi } from "./index";

export type TagToCreate = {
  label: string;
  type: string;
};

export type TagDb = TagToCreate & {
  id: string;
};

export const useTags = () => {
  return useQuery<TagDb[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      return await GraphApi.url("/tags").get().json();
    },
  });
};

export const useTagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tag: TagToCreate) => {
      return await GraphApi.url("/tags").post(tag).json<TagDb>();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};

export const useDeleteTagMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tagId: string) => {
      return await GraphApi.url(`/tags/${tagId}`).delete().json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};

export const useUpdateTagMutation = () => {
  return useMutation({
    mutationFn: async (tag: TagDb) => {
      return await GraphApi.url(`/tags/${tag.id}`).put(tag).json();
    },
  });
};
