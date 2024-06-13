// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { DontAskAgainDialog } from '@cosmotech/ui';

export const TableRevertDataDialog = ({ open, onClose, onConfirm }) => {
  const { t } = useTranslation();
  const labels = {
    title: t('genericcomponent.table.revertDataDialog.title', 'Revert table?'),
    body: t('genericcomponent.table.revertDataDialog.body', 'This will replace your data with initial dataset data.'),
    cancel: t('genericcomponent.table.revertDataDialog.cancel', 'Cancel'),
    confirm: t('genericcomponent.table.revertDataDialog.revert', 'Revert'),
    checkbox: t('genericcomponent.table.revertDataDialog.checkbox', "Don't show this message again"),
  };

  return (
    <DontAskAgainDialog
      id="revert-table-data-dialog"
      onClose={onClose}
      onConfirm={onConfirm}
      open={open}
      labels={labels}
      confirmButtonProps={{ color: 'error' }}
    />
  );
};

TableRevertDataDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
