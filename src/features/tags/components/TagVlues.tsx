import { useQuery } from "@tanstack/react-query";
import { GraphApi } from "../../../api";
import { useState } from "react";

type Tags = {
  id: string;
  label: string;
  type: string;
};

export const TagValues = (props: {
  entryTags: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
}) => {
  const [state, setState] = useState(props.entryTags);

  const { data: tags } = useQuery<Tags[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      return await GraphApi.url("/tags").get().json();
    },
  });

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
    const newState = { ...state, ...{ [label]: value } };
    setState(newState);
    props.onChange(newState);
  };

  return (
    <div className="flex">
      {tags?.map((tag) => {
        return (
          <div key={tag.id} className="flex mb-2 mr-4">
            <div className="mr-2">{tag.label}</div>
            <div>
              {tag.type === "range" && (
                <div>
                  <select
                    name="range"
                    id="range"
                    onChange={(e) =>
                      handleSelectChange(tag.label, e.target.value)
                    }
                  >
                    {ranges.map((r) => {
                      return (
                        <option
                          selected={props.entryTags[tag.label] === r.value}
                          key={r.value}
                          value={r.value}
                        >
                          {r.label}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
