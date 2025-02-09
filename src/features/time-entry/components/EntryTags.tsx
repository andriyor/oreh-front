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
import { useState } from "react";
import { TagValues } from "../../tags/components/TagVlues";
import { EntryDatesWithNode, EntryWithNode } from "../../graph/components/types";

export const EntryTags = (props: {
  entry: EntryWithNode;
  onUpdate: (entry: EntryDatesWithNode) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tags, setTags] = useState(props.entry.data);
  console.log('tags', tags)

  const onOpenChange = (isCurrentlyOpen: boolean) => {
    setIsOpen(isCurrentlyOpen);

    if (!isCurrentlyOpen) {
      props.onUpdate({ data: tags });
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
    <>
      <div className="flex" ref={refs.setReference} {...getReferenceProps()}>
        {Object.entries(props.entry.data).map(([key, val]) => (
          <div className="mr-1" key={key}>
            {key}: {val}
          </div>
        ))}
      </div>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            className="rounded-lg shadow-xl p-4"
            ref={refs.setFloating}
            style={{ ...floatingStyles, backgroundColor: "white" }}
            {...getFloatingProps()}
          >
            <TagValues entryTags={tags} onChange={(tags) => setTags(tags)} />
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
};
