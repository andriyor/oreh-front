import { format } from "date-fns";
import { groupBy } from "lodash";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { EntryWithNode } from "../../tree/components/types";
import { Entry } from "./Entry";
import { GraphApi } from "../../../api";
import { useTimerStore } from "../../../store";

export const EntryList = (props: {
  onStartTimer: (nodeId: string) => void;
}) => {
  const queryClient = useQueryClient();
  const setSelectedNodeId = useTimerStore((state) => state.setSelectedNodeId);
  const { data: entries } = useQuery<EntryWithNode[]>({
    queryKey: ["entry"],
    queryFn: async () => {
      return await GraphApi.url("/entry").get().json();
    },
  });

  const entryDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await GraphApi.url(`/entry/${id}`).delete().res();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entry"] });
    },
  });

  const groupped = groupBy(entries, (entry) =>
    format(entry.startTime, "MM.dd"),
  );

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
