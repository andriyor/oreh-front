import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Play from "../../../icons/play-solid.svg";
import TrashIcon from "../../../icons/trash-solid.svg";
import DotsIcon from "../../../icons/ellipsis-v-solid.svg";

import { EntryDatesWithNode, EntryWithNode } from "../../tree/components/types";
import { GraphApi } from "../../../api";
import { Time } from "./Time";
import { formatSeconds } from "../../../helpers";
import { EntryTags } from "./EntryTags";

export const Entry = (props: {
  entry: EntryWithNode;
  onStartTimer: () => void;
  onDelete: () => void;
}) => {
  const queryClient = useQueryClient();
  const [localEntry, setLocalEntry] = useState(props.entry);

  const updateEntryMutation = useMutation({
    mutationFn: async (entry: EntryDatesWithNode) => {
      return await GraphApi.url(`/entry/${localEntry.id}`)
        .put(entry)
        .json((json) => setLocalEntry(json));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entry"] });
    },
  });

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
        Node label: {props.entry.node.data?.label || ""}
      </div>

      <div className="basis-4/12">
        <EntryTags entry={props.entry} onUpdate={updateEntryMutation.mutate}/>
      </div>

      <div className="flex basis-4/12 justify-end">
        <div className="mr-3">
          <Time entry={localEntry} onUpdate={updateEntryMutation.mutate} />
        </div>
        <div className="mr-3">{formatSeconds(localEntry.duration)}</div>
      </div>

      <div className="flex basis-1/12 justify-end mr-3 mb-2">
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
