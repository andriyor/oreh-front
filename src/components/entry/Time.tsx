import { useState, useRef, useEffect } from "react";
import { format, setHours, setMinutes, differenceInSeconds } from "date-fns";
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
import { EntryDatesWithNode, EntryWithNode } from "../../nodes/types";


export const Time = ({
  entry,
  onUpdate,
}: {
  entry: EntryWithNode;
  onUpdate: (entry: EntryDatesWithNode) => void;
}) => {
  const [localEntry, setLocalEntry] = useState(entry);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setLocalEntry(entry);
  }, [entry]);

  const initialStartTime = useRef(new Date(localEntry.startTime));
  const initialStopTime = useRef(new Date(localEntry.stopTime));

  const [formatedStartTime, setFormatedStartTime] = useState(
    format(localEntry.startTime, "HH:mm")
  );
  const [formatedStopTime, setFormatedStopTime] = useState(
    format(localEntry.stopTime, "HH:mm")
  );

  const initialFormatedStartTime = useRef(formatedStartTime);
  const initialFormatedStopTime = useRef(formatedStopTime);

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
      if (
        initialFormatedStartTime.current !== formatedStartTime ||
        initialFormatedStopTime.current !== formatedStopTime
      ) {
        const newStartTime = updateHoursAndMinutes(
          formatedStartTime,
          initialStartTime.current
        );
        const newStopTime = updateHoursAndMinutes(
          formatedStopTime,
          initialStopTime.current
        );

        const duration = differenceInSeconds(newStopTime, newStopTime);
        onUpdate({
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
                  defaultValue={formatedStopTime}
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
