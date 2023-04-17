// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect, useRef, useState } from 'react';
import { Notifier } from '../../utils';
import { SimpleTwoActionsDialog } from '@cosmotech/ui';

const twoActionsDialogNotifier = new Notifier();

class TwoActionsDialogClass {
  openDialog(dialogProps) {
    return new Promise((resolve) => {
      dialogProps.resolve = resolve;
      twoActionsDialogNotifier.send(dialogProps);
    });
  }
}

const TwoActionsDialogGlobal = () => {
  const subscription = useRef();

  const resolver = useRef();
  const [dialogProps, setDialogProps] = useState({});
  const [open, setOpen] = useState(false);

  const onButtonClick = (index) => {
    setOpen(false);
    resolver.current(index);
  };

  useEffect(() => {
    function openDialog({ resolve, ...props }) {
      resolver.current = resolve;
      setDialogProps(props);
      setOpen(true);
    }

    subscription.current = twoActionsDialogNotifier.subscribe(openDialog);

    return () => {
      subscription.current.unsubscribe();
    };
  }, []);

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
