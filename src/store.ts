import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { ChartData } from "./features/tree/components/types";

type RunningNode = {
  id: string;
  startTime: string;
  label: string;
};

interface TimerState {
  chartData: ChartData[];
  setChartData: (chartData: ChartData[]) => void;

  selectedNodeId: string;
  setSelectedNodeId: (nodeId: string) => void;

  runningNode: RunningNode | undefined;
  setRunningNode: (state: RunningNode | undefined) => void;
}

export const useTimerStore = create<TimerState>()(
  devtools((set) => ({
    chartData: [],
    setChartData: (chartData) => set(() => ({ chartData })),

    selectedNodeId: "",
    setSelectedNodeId: (nodeId) => set(() => ({ selectedNodeId: nodeId })),

    runningNode: undefined,
    setRunningNode: (node) => set(() => ({ runningNode: node })),
  })),
);
