import { useQuery } from "@tanstack/react-query";
import { GraphApi } from "../../api";

export type Tags = {
  id: string;
  label: string;
  type: string;
};

export const TagList = () => {
  const { data: tags } = useQuery<Tags[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      return await GraphApi.url("/tags").get().json();
    },
  });

  return (
    <div>
      {tags?.map((tag) => {
        return <div key={tag.id}>{tag.label}: {tag.type}</div>
      })}
    </div>
  );
};
