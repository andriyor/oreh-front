import { ReactFlowProvider } from "@xyflow/react";
import { useLocalStorage, useMediaQuery } from "usehooks-ts";
import { VictoryPie, VictoryTheme } from "victory";

import { TopTimer } from "../components/Timer";
import { DoneToday } from "../features/dashboard/components/DoneToday";
import { HeatMap } from "../features/dashboard/components/HeatMap";
import { GraphFlow } from "../features/graph/components/Graph";
import { ChartByTags } from "../features/tags/components/TagChart";
import { TagValues } from "../features/tags/components/TagVlues";
import { EntryList } from "../features/time-entry/components/EntryList";
import { useTimerStore } from "../store";

export const Home = () => {
  const matches = useMediaQuery("(min-width: 1500px)");
  const [checkboxState, setCheckboxState] = useLocalStorage("tags-state", {});
  const chartData = useTimerStore((store) => store.chartData);

  return (
    <div style={{ height: "100%", display: matches ? "flex" : "block" }}>
      <div style={{ height: "60%", width: matches ? "50%" : "98%" }}>
        <TopTimer />
        <div className="mb-4 p-5 border-1 rounded-md border-solid border-gray-600">
          Current tags:
          <TagValues
            entryTags={checkboxState}
            onChange={(state) => setCheckboxState(state)}
          />
        </div>
        <ReactFlowProvider>
          <GraphFlow />
        </ReactFlowProvider>
        <div>
          <DoneToday />
        </div>
        <div className="m-5">
          <HeatMap />
        </div>

        <div className="m-5 marker:border-1 rounded-md border-solid border-gray-600">
          chart by tags:
          <ChartByTags />
        </div>
        <div className="m-5 border-1 rounded-md border-solid border-gray-600">
          Chart by selected node:
          {Boolean(chartData.length) && (
            <div style={{ height: "350px" }}>
              <VictoryPie data={chartData} theme={VictoryTheme.clean} />
            </div>
          )}
        </div>
      </div>

      <div className="flex m-5" style={{ width: matches ? "50%" : "98%" }}>
        <div className="flex-1">
          <EntryList />
        </div>
      </div>
    </div>
  );
};
