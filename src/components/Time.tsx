import { format } from "date-fns";
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
import { useState } from "react";

export const Time = ({ entry }: { entry: EntryWithNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    // placement: 'bottom',
    onOpenChange: setIsOpen,
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
        {format(entry.startTime, "HH:mm")} - {format(entry.stopTime, "HH:mm")}
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
                Start: <input type="text" value={format(entry.startTime, "HH:mm")} />
              </div>
              <div>
                Stop: <input type="text" value={format(entry.stopTime, "HH:mm")} />
              </div>
            </div>
          </div>
        </FloatingFocusManager>
      )}
    </div>
  );
};
