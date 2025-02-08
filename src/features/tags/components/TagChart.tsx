import { get } from "lodash";
import { useMemo, useState } from "react";
import { VictoryPie, VictoryTheme } from "victory";

import { useEntries } from "../../../api/entry";
import { useTags } from "../../../api/tags";

export const ChartByTags = () => {
  const [tag, setTag] = useState("");
  const { data: entries } = useEntries();
  const { data: tags } = useTags();

  const groupEntries = (data: any, by: string, sum: string) => {
    const res = data?.reduce((accumulator, currentValue) => {
      const path = get(currentValue, by);
      accumulator[path] = get(accumulator, path)
        ? get(accumulator, path) + get(currentValue, sum)
        : get(currentValue, sum);
      return accumulator;
    }, {});
    console.log("res", res);
    return res;
  };

  const graphData = useMemo(() => {
    if (entries?.length && tag) {
      const grouped = groupEntries(entries, `data.${tag}`, "duration");
      return Object.entries(grouped).map(([key, value]) => {
        return {
          x: key,
          y: value,
        };
      });
    } else {
      return [];
    }
  }, [entries, tag]);

  const handleTagChange = (tag: string) => {
    setTag(tag);
  };

  return (
    <div>
      <div>
        {tags?.length && (
          <select
            name="tag"
            id="tag"
            onChange={(e) => handleTagChange(e.target.value)}
          >
            {tags.map((t) => {
              return (
                <option key={t.label} value={t.label}>
                  {t.label}
                </option>
              );
            })}
          </select>
        )}
      </div>
      <div>
        {Boolean(graphData.length) && (
          <div style={{ height: "350px" }}>
            <VictoryPie data={graphData} theme={VictoryTheme.clean} />
          </div>
        )}
      </div>
    </div>
  );
};
