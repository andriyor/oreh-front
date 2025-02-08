import { ReactFlowProvider } from "@xyflow/react";
import { useLocalStorage, useMediaQuery } from "usehooks-ts";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { VictoryPie, VictoryTheme } from "victory";

import { GraphFlow } from "./features/graph/components/Graph";
import { TagValues } from "./features/tags/components/TagVlues";
import { TopTimer } from "./components/Timer";

import { DoneToday } from "./features/dashboard/components/DoneToday";
import { HeatMap } from "./features/dashboard/components/HeatMap";
import { ChartByTags } from "./features/tags/components/TagChart";
import { TagList } from "./features/tags/components/Tags";
import { EntryList } from "./features/time-entry/components/EntryList";
import { useTimerStore } from "./store";

const Wrapper = () => {
  const matches = useMediaQuery("(min-width: 1500px)");
  const [checkboxState, setCheckboxState] = useLocalStorage("tags-state", {});
  const chartData = useTimerStore((store) => store.chartData);

  return (
    <div style={{ height: "100%", display: matches ? "flex" : "block" }}>
      <div style={{ height: "50%", width: matches ? "50%" : "98%" }}>
        <TopTimer />
        <div className="p-5 border-1 rounded-md border-solid border-gray-600">
          Current tags:
          <TagValues
            entryTags={checkboxState}
            onChange={(state) => setCheckboxState(state)}
          />
        </div>
        <ReactFlowProvider>
          <GraphFlow/>
        </ReactFlowProvider>
        <div>
          <DoneToday />
        </div>
        <div className="m-5">
          <HeatMap />
        </div>
        <div className="m-5 border-1 rounded-md border-solid border-gray-600">
          Tag list:
          <TagList />
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
          <EntryList/>
        </div>
      </div>
    </div>
  );
};

const queryClient = new QueryClient();

export default () => (
  <QueryClientProvider client={queryClient}>
    <Wrapper />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
