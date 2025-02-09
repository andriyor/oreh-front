import { format } from "date-fns";

import { useNodes } from "../../../api/node";

export const DoneToday = () => {
  const today = format(new Date(), "yyyy-MM-dd");
  const { data } = useNodes({
    from: today,
    to: today,
  });

  return (
    <div className="border-1 rounded-md border-solid border-gray-600">
      Done Today:
      {data?.map((node) => (
        <div className="mb-2" key={node.id}>
          {node.data.label}
        </div>
      ))}
    </div>
  );
};
