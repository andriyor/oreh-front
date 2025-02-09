import { useCallback, useState } from "react";

import {
  TagDb,
  useDeleteTagMutation,
  useTagMutation,
  useTags,
  useUpdateTagMutation,
} from "../api/tags";
import { debounce } from "../helpers";

export const TagPage = () => {
  const { data: tags } = useTags();
  const [value, setValue] = useState("");
  const tagMutation = useTagMutation();
  const tagDeleteMutation = useDeleteTagMutation();
  const updateTagMutation = useUpdateTagMutation();

  const handleAddtag = () => {
    tagMutation.mutate({
      label: value,
      type: "range",
    });
  };

  const handleDelete = (tagId: string) => {
    tagDeleteMutation.mutate(tagId);
  };

  const handleDebouncedChange = useCallback(
    debounce((tag: TagDb, label: string) => {
      updateTagMutation.mutate({
        ...tag,
        label,
      });
    }, 500),
    [],
  );

  return (
    <div>
      {tags?.map((tag) => {
        return (
          <div key={tag.id} className="flex mb-2">
            <div className="mr-2">
              <input
                type="text"
                defaultValue={tag.label}
                onChange={(e) => handleDebouncedChange(tag, e.target.value)}
              />
            </div>
            <div className="mr-2">{tag.type}</div>
            <div>
              <button onClick={() => handleDelete(tag.id)}>Delete</button>
            </div>
          </div>
        );
      })}
      <div className="flex">
        <div className="mr-2">
          <input type="text" onChange={(e) => setValue(e.target.value)} />
        </div>
        <div>
          <button onClick={handleAddtag}>add</button>
        </div>
      </div>
    </div>
  );
};
