import { useState, useRef, useEffect } from "react";
import {
  format,
  setHours,
  setMinutes,
  differenceInSeconds,
  getDay,
  getYear,
  setYear,
  setDay,
  getMonth,
  setMonth,
} from "date-fns";
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

import { EntryDatesWithNode, EntryWithNode } from "../../graph/components/types";

const updateHoursAndMinutes = (
  initialTime: Date,
  newHoursMinutesTime: string,
  dateYear: { day: number; month: number; year: number },
) => {
  const [startHours, startMinutes] = newHoursMinutesTime.split(":");
  const updated = setHours(
    setMinutes(initialTime, Number(startMinutes)),
    Number(startHours),
  );
  return setYear(
    setMonth(setDay(updated, dateYear.day), dateYear.month),
    dateYear.year,
  );
};

export const Time = (props: {
  entry: EntryWithNode;
  onUpdate: (entry: EntryDatesWithNode) => void;
}) => {
  const [calendarValue, setCalendarValue] = useState<Date>(
    new Date(props.entry.startTime),
  );
  const [localEntry, setLocalEntry] = useState(props.entry);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setLocalEntry(props.entry);
  }, [props.entry]);

  const initialStartTime = useRef(new Date(localEntry.startTime));
  const initialStopTime = useRef(new Date(localEntry.stopTime));

  const [formatedStartTime, setFormatedStartTime] = useState(
    format(localEntry.startTime, "HH:mm"),
  );
  const [formatedStopTime, setFormatedStopTime] = useState(
    format(localEntry.stopTime, "HH:mm"),
  );

  const initialFormatedStartTime = useRef(formatedStartTime);
  const initialFormatedStopTime = useRef(formatedStopTime);

  const initialYear = useRef(getYear(localEntry.startTime));
  const initialMonth = useRef(getMonth(localEntry.startTime));
  const initialDay = useRef(getDay(localEntry.startTime));

  const onOpenChange = (isCurrentlyOpen: boolean) => {
    setIsOpen(isCurrentlyOpen);

    if (!isCurrentlyOpen) {
      const year = getYear(calendarValue);
      const month = getMonth(calendarValue);
      const day = getDay(calendarValue);

      const isCalendarChanged =
        year !== initialYear.current ||
        month !== initialMonth.current ||
        day !== initialDay.current;

      const isTimeChanged =
        initialFormatedStartTime.current !== formatedStartTime ||
        initialFormatedStopTime.current !== formatedStopTime;

      if (isCalendarChanged || isTimeChanged) {
        const newStartTime = updateHoursAndMinutes(
          initialStartTime.current,
          formatedStartTime,
          { day, month, year },
        );
        const newStopTime = updateHoursAndMinutes(
          initialStopTime.current,
          formatedStopTime,
          { day, month, year },
        );

        const duration = differenceInSeconds(newStopTime, newStopTime);
        props.onUpdate({
          duration,
          startTime: newStartTime,
          stopTime: newStopTime,
        });
      }
    }
  };

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    // placement: 'bottom',
    onOpenChange,
    middleware: [
      offset(10),
      flip({ fallbackAxisSideDirection: "end" }),
      shift(),
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  return (
    <div>
      <div ref={refs.setReference} {...getReferenceProps()}>
        <span className="mr-2">{format(localEntry.startTime, "HH:mm")}</span>
        <span>{format(localEntry.stopTime, "HH:mm")}</span>
      </div>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            className="rounded-lg shadow-xl"
            ref={refs.setFloating}
            style={{ ...floatingStyles, backgroundColor: "white" }}
            {...getFloatingProps()}
          >
            <div className="grid grid-cols-2 gap-4 p-5">
              <div>
                <div className="mb-2">Start:</div>
                <input
                  style={{ width: "125px" }}
                  type="text"
                  defaultValue={formatedStartTime}
                  onChange={(e) => setFormatedStartTime(e.target.value)}
                />
              </div>
              <div>
                <div className="mb-2">Stop:</div>
                <input
                  style={{ width: "125px" }}
                  type="text"
                  defaultValue={formatedStopTime}
                  onChange={(e) => setFormatedStopTime(e.target.value)}
                />
              </div>
            </div>
            <div className="h-px bg-gray-300"></div>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateCalendar
                value={calendarValue}
                onChange={(newValue) => setCalendarValue(newValue)}
              />
            </LocalizationProvider>
          </div>
        </FloatingFocusManager>
      )}
    </div>
  );
};
