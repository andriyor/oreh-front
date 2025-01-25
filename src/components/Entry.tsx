import { useState } from "react";
import { EntryDatesWithNode, EntryWithNode } from "../nodes/types";
import { Time } from "./Time";
import Play from "../icons/play-solid.svg";
import { formatSeconds } from "../helpers";

export const Entry = (props: {
  entry: EntryWithNode;
  onStartTimer: () => void;
}) => {
  const [localEntry, setLocalEntry] = useState(props.entry);

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
        <div className="mr-5">Node label: {props.entry.node.data.label}</div>
        <div className="mr-5">
          <Time entry={localEntry} onUpdate={handleUpdate} />
        </div>
        <div className="mr-5">{formatSeconds(localEntry.duration)}</div>
        <div>
          <button onClick={() => props.onStartTimer()}>
            <img src={Play} height="15px" />
          </button>
        </div>
      </div>
    </div>
  );
};
