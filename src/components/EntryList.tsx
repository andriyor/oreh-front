import { format } from "date-fns";
import { groupBy } from "lodash";

import { EntryWithNode } from "../nodes/types";
import { Entry } from "./Entry";
import { useQuery } from "@tanstack/react-query";

export const EntryList = (props: {
  onClick: (id: string) => void;
  onStartTimer: (nodeId: string) => void;
}) => {
  const { data: entries } = useQuery<EntryWithNode[]>({
    queryKey: ["entry"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/entry");
      return await response.json();
    },
  });

  const groupped = groupBy(entries, (entry) =>
    format(entry.startTime, "MM.dd")
  );

  return (
    <div>
      {Object.keys(groupped).map((day) => {
        return (
          <div key={day}>
            <div className="mb-2">Day: {day}</div>
            {groupped[day].map((entry) => (
              <div
                key={entry.id}
                className="mb-2"
                onClick={() => props.onClick(entry.node.id)}
              >
                <Entry
                  entry={entry}
                  onStartTimer={() => props.onStartTimer(entry.node.id)}
                />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
