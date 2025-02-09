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
import {
  EntryDatesWithNode,
  EntryWithNode,
} from "../../graph/components/types";
import { TagDb, useTags } from "../../../api/tags";
import { tagIcons } from "../../tags/types";

export const EntryTags = (props: {
  entry: EntryWithNode;
  onUpdate: (entry: EntryDatesWithNode) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [entryTags, setEntryTags] = useState(props.entry.data);
  const { data: tags } = useTags();

  const tagsMap = tags?.reduce<Record<string, TagDb>>((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {});

  const onOpenChange = (isCurrentlyOpen: boolean) => {
    setIsOpen(isCurrentlyOpen);

    if (!isCurrentlyOpen) {
      props.onUpdate({ data: entryTags });
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
        {tagsMap &&
          Object.entries(props.entry.data).map(([id, val]) => {
            const tagLabel = tagsMap[id]?.label;
            return (
              <>
                {tagLabel && (
                  <div className="flex mr-4" key={id}>
                    <div>{tagLabel}:</div>
                    <div>{tagIcons[val]}</div>
                  </div>
                )}
              </>
            );
          })}
      </div>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            className="rounded-lg shadow-xl p-4"
            ref={refs.setFloating}
            style={{ ...floatingStyles, backgroundColor: "white" }}
            {...getFloatingProps()}
          >
            <TagValues
              currentTags={entryTags}
              onChange={(tags) => setEntryTags(tags)}
            />
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
};
