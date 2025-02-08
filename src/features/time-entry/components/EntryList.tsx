import { format } from "date-fns";
import { groupBy } from "lodash";

import { EntryWithNode } from "../../tree/components/types";
import { Entry } from "./Entry";
import { useTimerStore } from "../../../store";
import { useEntries, useEntryDeleteMutation } from "../../../api/entry";

export const EntryList = () => {
  const setSelectedNodeId = useTimerStore((state) => state.setSelectedNodeId);
  const setRunningNode = useTimerStore((state) => state.setRunningNode);
  const entryDeleteMutation = useEntryDeleteMutation();
  const { data: entries } = useEntries();

  const groupped = groupBy(entries, (entry) =>
    format(entry.startTime, "MM.dd"),
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
      {Object.keys(groupped).map((day) => {
        return (
          <div key={day}>
            <div className="mb-3">Day: {day}</div>
            {groupped[day].map((entry) => (
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
        );
      })}
    </div>
  );
};
