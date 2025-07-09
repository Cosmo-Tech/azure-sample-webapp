// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { DontAskAgainDialog } from '@cosmotech/ui';

export const TableDeleteRowsDialog = (props) => {
  const { t } = useTranslation();
  const { open, onClose, onConfirm, selectedRowsCount } = props;
  const labels = {
    title: t('genericcomponent.table.deleteRowsDialog.title', 'Delete selected lines?'),
    body: t('genericcomponent.table.deleteRowsDialog.body', { count: selectedRowsCount }),
    cancel: t('genericcomponent.table.deleteRowsDialog.cancel', 'Cancel'),
    confirm: t('genericcomponent.table.deleteRowsDialog.confirm', 'Delete'),
    checkbox: t('genericcomponent.table.deleteRowsDialog.checkbox', "Don't show this message again"),
  };
  return (
    <DontAskAgainDialog
      id="delete-rows-dialog"
      onClose={onClose}
      onConfirm={onConfirm}
      open={open}
      labels={labels}
      confirmButtonProps={{ color: 'error' }}
    ></DontAskAgainDialog>
  );
};

TableDeleteRowsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  selectedRowsCount: PropTypes.number.isRequired,
};
