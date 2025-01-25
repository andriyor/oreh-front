import { useEffect, useState } from "react";
import { EntryWithNode } from "../nodes/types";
import { format } from "date-fns";
import { groupBy } from "lodash";
import { Entry } from "./Entry";

export const EntryList = (props: { onClick: (id: string) => void }) => {
  const [entries, setEntries] = useState<EntryWithNode[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/entry")
      .then((response) => response.json())
      .then((res) => setEntries(res));
  }, []);

  const groupped = groupBy(entries, (entry) =>
    format(entry.startTime, "MM.dd")
  );

  return (
    <div>
      {Object.keys(groupped).map((day) => {
        return (
          <div>
            <div className="mb-2">Day: {day}</div>
            {groupped[day].map((entry) => (
              <div
                className="mb-2"
                onClick={() => props.onClick(entry.node.id)}
              >
                <Entry entry={entry} />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
