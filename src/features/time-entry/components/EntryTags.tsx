import { FloatingFocusManager } from "@floating-ui/react";
import { useState } from "react";

import { TagValues } from "../../tags/components/TagVlues";
import { EntryDatesWithNode, EntryWithNode } from "../../graph/components/types";
import { TagDb, useTags } from "../../../api/tags";
import { tagIcons } from "../../tags/types";
import { useFloatingUI } from "../../../hooks/use-floating";

export const EntryTags = (props: { entry: EntryWithNode; onUpdate: (entry: EntryDatesWithNode) => void }) => {
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

  const { refs, floatingStyles, getReferenceProps, getFloatingProps, context } = useFloatingUI({
    isOpen,
    onOpenChange,
  });

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
                    <div className="mr-1">{tagLabel}:</div>
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
            <TagValues currentTags={entryTags} onChange={(tags) => setEntryTags(tags)} />
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
};
