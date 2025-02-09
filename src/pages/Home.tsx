import { ReactFlowProvider } from "@xyflow/react";
import { useLocalStorage } from "usehooks-ts";
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
  const [checkboxState, setCheckboxState] = useLocalStorage("tags-state", {});
  const chartData = useTimerStore((store) => store.chartData);

  return (
    <div className="flex flex-row">
      <div className="basis-6/12">
        <TopTimer />
        <div className="mb-4 p-5 border-1 rounded-md border-solid border-gray-600">
          Current tags:
          <TagValues
            isHorizontal={true}
            entryTags={checkboxState}
            onChange={(state) => setCheckboxState(state)}
          />
        </div>
        <div style={{ height: "600px" }}>
          <ReactFlowProvider>
            <GraphFlow />
          </ReactFlowProvider>
        </div>

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

      <div className="basis-6/12 flex m-5">
        <div className="flex-1">
          <EntryList />
        </div>
      </div>
    </div>
  );
};
