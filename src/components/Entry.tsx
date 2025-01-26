import { useState } from "react";
import wretch from "wretch";
import { EntryDatesWithNode, EntryWithNode } from "../nodes/types";
import { Time } from "./Time";
import Play from "../icons/play-solid.svg";
import Trash from "../icons/trash-solid.svg";
import { formatSeconds } from "../helpers";

export const Entry = (props: {
  entry: EntryWithNode;
  onStartTimer: () => void;
  onDelete: () => void;
}) => {
  const [localEntry, setLocalEntry] = useState(props.entry);

  const handleUpdate = (entry: EntryDatesWithNode) => {
    wretch(`http://127.0.0.1:3000/entry/${localEntry.id}`)
      .put(entry)
      .json((json) => setLocalEntry(json));
  };

  return (
    <div
      className="flex flex-row"
      style={{
        borderBottomColor: "grey",
        borderBottomStyle: "solid",
        borderBottomWidth: "1px",
      }}
    >
      <div className="basis-6/12 mr-3">
        Node label: {props.entry.node.data.label}
      </div>

      <div className="flex basis-5/12 justify-end">
        <div className="mr-3">
          <Time entry={localEntry} onUpdate={handleUpdate} />
        </div>
        <div className="mr-3">{formatSeconds(localEntry.duration)}</div>
      </div>

      <div className="flex basis-1/12 justify-end mr-3 mb-2">
        <div className="mr-3">
          <button onClick={() => props.onStartTimer()}>
            <img src={Play} height="15px" />
          </button>
        </div>

        <div>
          <button onClick={() => props.onDelete()}>
            <img src={Trash} height="15px" />
          </button>
        </div>
      </div>
    </div>
  );
};
