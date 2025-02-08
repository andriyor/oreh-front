import { useTags } from "../../../api/tags";

export const TagList = () => {
  const { data: tags } = useTags();

  return (
    <div>
      {tags?.map((tag) => {
        return <div key={tag.id}>{tag.label}: {tag.type}</div>
      })}
    </div>
  );
};
