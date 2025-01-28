import { useQuery } from "@tanstack/react-query";
import { GraphApi } from "../../api";
import { useState } from "react";

type Tags = {
  id: string;
  label: string;
  type: string;
};

export const TagValues = (props: {
  onChange: (value: unknown) => void
}) => {
  const { data: tags } = useQuery<Tags[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      return await GraphApi.url("/tags").get().json();
    },
  });

  const [state, setState] = useState({});

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
    <div>
      {tags?.map((tag) => {
        return (
          <div key={tag.id} className="flex">
            <div>{tag.label}</div>
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
                        <option key={r.value} value={r.value}>
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
      <div>{JSON.stringify(state)}</div>
    </div>
  );
};
