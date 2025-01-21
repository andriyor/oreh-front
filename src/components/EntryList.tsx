import { useEffect, useRef, useState } from "react";
import { EntryWithNode } from "../nodes/types";
import { format } from "date-fns";
import { groupBy } from "lodash";
import { Entry } from "./Entry";

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
              <Entry entry={entry}/>
            ))}
          </div>
        );
      })}
    </div>
  );
};
