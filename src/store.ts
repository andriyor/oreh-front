import { create } from "zustand";
import { devtools } from 'zustand/middleware'

type RunningNode = {
  id: string;
  startTime: string;
  label: string;
}

interface TimerState {
  runningNode: RunningNode | undefined;
  setRunningNode: (state: RunningNode | undefined) => void;
}

export const useTimerStore = create<TimerState>()(devtools((set) => ({
  runningNode: undefined,
  setRunningNode: (node) => set(() => ({ runningNode: node })),
})));
