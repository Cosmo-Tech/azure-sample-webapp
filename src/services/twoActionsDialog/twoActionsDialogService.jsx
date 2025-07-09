// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useRef, useState } from 'react';
import { SimpleTwoActionsDialog } from '@cosmotech/ui';
import { Notifier, useSubscribeToNotifier } from '../../utils';

const twoActionsDialogNotifier = new Notifier();

const TwoActionsDialogActions = {
  OPEN: 'Open',
  CLOSE: 'Close',
};

class TwoActionsDialogClass {
  openDialog(dialogProps) {
    return new Promise((resolve) => {
      dialogProps.resolve = (index) => {
        this._openedDialogId = '';
        resolve(index);
      };
      this._openedDialogId = dialogProps.id;
      twoActionsDialogNotifier.send({
        resolve,
        action: TwoActionsDialogActions.OPEN,
        dialogProps,
      });
    });
  }

  closeDialog() {
    this._openedDialogId = '';

    twoActionsDialogNotifier.send({
      action: TwoActionsDialogActions.CLOSE,
    });
  }

  get openedDialogId() {
    return this._openedDialogId;
  }
}

const TwoActionsDialogGlobal = () => {
  const resolver = useRef();
  const [dialogProps, setDialogProps] = useState({});
  const [open, setOpen] = useState(false);

  const onButtonClick = (index) => {
    setOpen(false);
    resolver.current(index);
  };

  const closeDialog = useCallback(() => {
    if (open) {
      setOpen(false);
      resolver.current(1);
    }
  }, [open]);

  const openDialog = useCallback((resolve, dialogProps) => {
    resolver.current = resolve;
    setDialogProps(dialogProps);
    setOpen(true);
  }, []);

  const handleNotifier = useCallback(
    (notification) => {
      switch (notification.action) {
        case TwoActionsDialogActions.OPEN:
          openDialog(notification.resolve, notification.dialogProps);
          break;

        case TwoActionsDialogActions.CLOSE:
          closeDialog();
          break;
      }
    },
    [closeDialog, openDialog]
  );

  useSubscribeToNotifier(twoActionsDialogNotifier, handleNotifier);

  return (
    <SimpleTwoActionsDialog
      id="global-dialog"
      {...dialogProps}
      open={open}
      handleClickOnButton1={() => onButtonClick(1)}
      handleClickOnButton2={() => onButtonClick(2)}
    />
  );
};

const TwoActionsDialogService = new TwoActionsDialogClass();
export { TwoActionsDialogService, TwoActionsDialogGlobal };
