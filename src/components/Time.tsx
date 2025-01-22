import { useState, useRef } from "react";
import { format, setHours, setMinutes } from "date-fns";
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

import { EntryWithNode } from "../nodes/types";

export const Time = ({ entry }: { entry: EntryWithNode }) => {
  const [localEntry, setLocalEntry] = useState(entry);
  const [isOpen, setIsOpen] = useState(false);

  const initialStartTime = useRef(new Date(localEntry.startTime));
  const initialStopTime = useRef(new Date(localEntry.stopTime));

  const [formatedStartTime, setFormatedStartTime] = useState(
    format(localEntry.startTime, "HH:mm")
  );
  const [formatedStopTime, setFormatedStopTime] = useState(
    format(localEntry.startTime, "HH:mm")
  );

  const updateHoursAndMinutes = (
    newHoursMinutesTime: string,
    initialTime: Date
  ) => {
    const [startHours, startMinutes] = newHoursMinutesTime.split(":");
    return setHours(
      setMinutes(initialTime, Number(startMinutes)),
      Number(startHours)
    );
  };

  const onOpenChange = (value: boolean) => {
    setIsOpen(value);

    if (!value) {
      const newStartTime = updateHoursAndMinutes(
        formatedStartTime,
        initialStartTime.current
      );
      const newStopTime = updateHoursAndMinutes(
        formatedStopTime,
        initialStopTime.current
      );

      fetch(`http://127.0.0.1:3000/entry/${localEntry.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          duration: localEntry.duration,
          startTime: newStartTime,
          stopTime: newStopTime,
        }),
      })
        .then((res) => res.json())
        .then((json) => setLocalEntry(json));
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
            ref={refs.setFloating}
            style={{ ...floatingStyles, backgroundColor: "white" }}
            {...getFloatingProps()}
          >
            <div className="flex">
              <div>
                <div>Start:</div>
                <input
                  type="text"
                  defaultValue={formatedStartTime}
                  onChange={(e) => setFormatedStartTime(e.target.value)}
                />
              </div>
              <div>
                <div>Stop:</div>
                <input
                  type="text"
                  defaultValue={formatedStartTime}
                  onChange={(e) => setFormatedStopTime(e.target.value)}
                />
              </div>
            </div>
          </div>
        </FloatingFocusManager>
      )}
    </div>
  );
};
