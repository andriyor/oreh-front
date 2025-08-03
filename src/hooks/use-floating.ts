import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
} from '@floating-ui/react';

export function useFloatingUI({ isOpen, onOpenChange }: {
  isOpen: boolean;
  onOpenChange: (isCurrentlyOpen: boolean) => void;
}) {
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange,
    middleware: [offset(10), flip({ fallbackAxisSideDirection: 'end' }), shift()],
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

  return {
    refs,
    floatingStyles,
    getReferenceProps,
    getFloatingProps,
    context,
  };
}
