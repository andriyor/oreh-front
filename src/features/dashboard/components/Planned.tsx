import { format } from "date-fns";
import { usePlanned } from "../../../api/node.ts";

export const Planned = () => {
  const { data } = usePlanned();

  console.log("Planned", data);

  return (
    <div className="p-3 border-1 rounded-md border-solid border-gray-600">
      Planned:
      {data?.map((node) => (
        <div className="flex mb-2 " key={node.id}>
          <div className="mr-2">{node.data.label}</div>
          <div>{format(node.dueDate!, "dd:MM:Y")}</div>
        </div>
      ))}
    </div>
  );
};
