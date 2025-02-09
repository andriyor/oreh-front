import { useState } from "react";

import Play from "../../../icons/play-solid.svg";
import TrashIcon from "../../../icons/trash-solid.svg";
import DotsIcon from "../../../icons/ellipsis-v-solid.svg";

import {
  EntryDatesWithNode,
  EntryWithNode,
} from "../../graph/components/types";
import { Time } from "./Time";
import { formatSeconds } from "../../../helpers";
import { EntryTags } from "./EntryTags";
import { useUpdateEntryMutation } from "../../../api/entry";

export const Entry = (props: {
  entry: EntryWithNode;
  onStartTimer: () => void;
  onDelete: () => void;
}) => {
  const [localEntry, setLocalEntry] = useState(props.entry);
  const updateEntryMutation = useUpdateEntryMutation(props.entry.id);

  const handleUpdate = (entry: EntryDatesWithNode) => {
    updateEntryMutation.mutateAsync(entry).then((response) => {
      setLocalEntry(response);
    });
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
      <div className="basis-3/12 mr-3">
        {props.entry.node.data?.label || ""}
      </div>

      <div className="basis-6/12">
        <EntryTags entry={props.entry} onUpdate={handleUpdate} />
      </div>

      <div className="basis-2/12 flex justify-end">
        <div className="mr-3">
          <Time entry={localEntry} onUpdate={handleUpdate} />
        </div>
        <div className="mr-3">{formatSeconds(localEntry.duration)}</div>
      </div>

      <div className="basis-1/12 flex justify-end mr-3 mb-2">
        <div className="mr-3">
          <button onClick={() => props.onStartTimer()}>
            <img src={Play} height="15px" />
          </button>
        </div>

        <div className="mr-3">
          <button onClick={() => props.onDelete()}>
            <img src={TrashIcon} height="15px" />
          </button>
        </div>

        <div>
          <button>
            <img src={DotsIcon} height="15px" />
          </button>
        </div>
      </div>
    </div>
  );
};
