
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

/**
 * A hook for creating confirmation dialogs
 */
export function useConfirm() {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<ConfirmOptions>({});
  const [resolve, setResolve] = React.useState<(value: boolean) => void>(() => () => {});

  const confirm = (options: ConfirmOptions = {}) => {
    return new Promise<boolean>((res) => {
      setOptions(options);
      setOpen(true);
      setResolve(() => res);
    });
  };

  const handleConfirm = () => {
    resolve(true);
    setOpen(false);
  };

  const handleCancel = () => {
    resolve(false);
    setOpen(false);
  };

  const ConfirmDialog = () => (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{options.title || 'Are you sure?'}</AlertDialogTitle>
          <AlertDialogDescription>
            {options.description || 'This action cannot be undone.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {options.cancelText || 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {options.confirmText || 'Continue'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { confirm, ConfirmDialog };
}

export default useConfirm;
