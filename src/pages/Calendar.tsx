import { useState } from "react";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { useNodes } from "../api/node";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const NodeCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleNavigate = (date: Date) => {
    setCurrentDate(date);
  };

  const { data } = useNodes({
    from: startOfMonth(currentDate).toISOString(),
    to: endOfMonth(currentDate).toISOString(),
  });

  const events = data?.map((event) => {
    return {
      id: event.id,
      title: event.data.label,
      start: new Date(event.data.doneAt as unknown as string),
      end: new Date(event.data.doneAt as unknown as string),
    };
  });

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        titleAccessor="title"
        startAccessor="start"
        endAccessor="end"
        date={currentDate}
        style={{ height: 500 }}
        onNavigate={handleNavigate}
      />
    </div>
  );
};
