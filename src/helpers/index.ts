import { format, startOfDay, addSeconds } from "date-fns";

export const formatSeconds = (seconds: number) => {
  const date = addSeconds(startOfDay(new Date(0)), seconds);
  return format(date, "HH:mm:ss")
}
