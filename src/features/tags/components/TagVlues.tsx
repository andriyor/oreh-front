import { useState } from "react";

import { useTags } from "../../../api/tags";

export const TagValues = (props: {
  isHorizontal: boolean;
  entryTags: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
}) => {
  const [entryTags, setEntryTags] = useState(props.entryTags);

  const { data: tags } = useTags();

  const ranges = [
    {
      value: "mid",
      label: "Mid",
    },
    {
      value: "moderate",
      label: "Moderate",
    },
    {
      value: "severe",
      label: "Severe",
    },
    {
      value: "unbeatable",
      label: "Unbeatable",
    },
  ];

  const handleSelectChange = (label: string, value: string) => {
    const newState = { ...entryTags, ...{ [label]: value } };
    setEntryTags(newState);
    props.onChange(newState);
  };

  return (
    <div className={props.isHorizontal ? 'flex' : ''} >
      {tags?.map((tag) => (
        <div key={tag.id} className="flex mb-2 mr-4">
          <div className="mr-2">{tag.label}</div>
          <div className="ml-auto">
            {tag.type === "range" && (
              <select
                name="range"
                id="range"
                onChange={(e) => handleSelectChange(tag.label, e.target.value)}
              >
                {ranges.map((r) => (
                  <option
                    selected={props.entryTags[tag.label] === r.value}
                    key={r.value}
                    value={r.value}
                  >
                    {r.label}
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
