import { format } from "date-fns";

import { EntryWithNode } from "../../graph/components/types";
import { Entry } from "./Entry";
import { useTimerStore } from "../../../store";
import { useEntries, useEntryDeleteMutation } from "../../../api/entry";
import { formatSeconds } from "../../../helpers";

type AggregatedResult = {
  entries: EntryWithNode[];
  totalDuration: number;
};

export const EntryList = () => {
  const setSelectedNodeId = useTimerStore((state) => state.setSelectedNodeId);
  const setRunningNode = useTimerStore((state) => state.setRunningNode);
  const entryDeleteMutation = useEntryDeleteMutation();
  const { data: entries } = useEntries();

  const groupped = entries?.reduce<Record<string, AggregatedResult>>(
    (acc, curr) => {
      const day = format(curr.startTime, "MM.dd");
      if (acc[day]) {
        acc[day].entries.push(curr);
        acc[day].totalDuration += curr.duration;
      } else {
        acc[day] = {
          entries: [curr],
          totalDuration: curr.duration,
        };
      }
      return acc;
    },
    {},
  );

  const startTimer = (entry: EntryWithNode) => {
    setRunningNode({
      id: entry.node.id,
      startTime: new Date().toISOString(),
      label: entry.node.data.label || "",
    });
  };

  return (
    <div>
      {groupped &&
        Object.keys(groupped).map((day) => (
          <div key={day}>
            <div className="flex mb-2">
              <div>Day: {day}</div>
              <div className="ml-auto">
                {formatSeconds(groupped[day].totalDuration)}
              </div>
            </div>

            {groupped[day].entries.map((entry) => (
              <div
                key={entry.id}
                className="mb-3"
                onClick={() => setSelectedNodeId(entry.node.id)}
              >
                <Entry
                  entry={entry}
                  onDelete={() => entryDeleteMutation.mutate(entry.id)}
                  onStartTimer={() => startTimer(entry)}
                />
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};
