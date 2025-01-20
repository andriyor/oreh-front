import { useEffect, useState } from "react";
import { EntryWithNode } from "../nodes/types";
import { format } from "date-fns";
import { groupBy } from "lodash";

export const EntryList = () => {
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
            <div>Day: {day}</div>
            {groupped[day].map((entry) => (
              <div className="flex">
                <div className="mr-5">Node: {entry.node.data.label}</div>
                <div className="mr-5">
                  Start: {format(entry.startTime, "HH:mm")}
                </div>
                <div className="mr-5">
                  Stop: {format(entry.stopTime, "HH:mm")}
                </div>
                <div>Duration: {entry.duration}</div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
