import { useState } from "react";

import { TagDb, useTags } from "../../../api/tags";
import { ranges } from "../types";



export const TagValues = (props: {
  isHorizontal?: boolean;
  entryTags: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
}) => {
  const [currentTags, setCurrentTags] = useState(props.entryTags);

  const { data: tags } = useTags();

  const handleSelectChange = (tag: TagDb, value: string) => {
    const newState = { ...currentTags, ...{ [tag.id]: value } };
    setCurrentTags(newState);
    props.onChange(newState);
  };

  return (
    <div className={props.isHorizontal ? "flex" : ""}>
      {tags?.map((tag) => (
        <div key={tag.id} className="flex mb-2 mr-4">
          <div className="mr-2">{tag.label}</div>
          <div className="ml-auto">
            {tag.type === "range" && (
              <select
                name="range"
                id="range"
                onChange={(e) => handleSelectChange(tag, e.target.value)}
              >
                {ranges.map((range) => (
                  <option
                    selected={props.entryTags[tag.label] === range.value}
                    key={range.value}
                    value={range.value}
                  >
                    {range.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
