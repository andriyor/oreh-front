import { EntryWithNode } from "../nodes/types";
import { Time } from "./Time";

export const Entry = ({ entry }: { entry: EntryWithNode }) => {

  return (
    <div>
      <div className="flex">
        <div className="mr-5">Node: {entry.node.data.label}</div>
        <div className="mr-5">
          <Time entry={entry} />
        </div>
        <div>Duration: {entry.duration}</div>
      </div>
    </div>
  );
};
