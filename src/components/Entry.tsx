import { useState } from "react";
import { EntryDatesWithNode, EntryWithNode } from "../nodes/types";
import { Time } from "./Time";

import { formatSeconds } from "../helpers";

export const Entry = ({ entry }: { entry: EntryWithNode }) => {
  const [localEntry, setLocalEntry] = useState(entry);

  const handleUpdate = (entry: EntryDatesWithNode) => {
    fetch(`http://127.0.0.1:3000/entry/${localEntry.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entry),
    })
      .then((res) => res.json())
      .then((json) => setLocalEntry(json));
  };

  return (
    <div>
      <div className="flex">
        <div className="mr-5">Node: {entry.node.data.label}</div>
        <div className="mr-5">
          <Time entry={localEntry} onUpdate={handleUpdate} />
        </div>
        <div>{formatSeconds(localEntry.duration, "HH:mm:ss")}</div>
      </div>
    </div>
  );
};
