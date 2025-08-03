import { useAggregatedNodes } from "../../../api/node.ts";
import { endOfDay, startOfDay } from "date-fns";
import { formatSeconds } from "../../../helpers";

export const Planned = () => {
  const { data } = useAggregatedNodes({
    from: startOfDay(now).toISOString(),
    to: endOfDay(now).toISOString(),
  });

  return (
    <div className="p-3 border-1 rounded-md border-solid border-gray-600">
      Done Today:
      {data?.map((node) => (
        <div className="flex mb-2 " key={node.id}>
          <div>{node.data.label}</div>
          <div className="ml-auto">{formatSeconds(node.totalDuration)}</div>
        </div>
      ))}
    </div>
  );
}
