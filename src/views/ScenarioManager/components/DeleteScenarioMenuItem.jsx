// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { MenuItem, Stack, Typography } from '@mui/material';
import { FadingTooltip } from '@cosmotech/ui';
import { useDeleteScenarioBatchButton } from './DeleteScenarioBatchButtonHook';

const WrappedMenuItem = ({ tooltipProps, menuItemProps, children }) => (
  <FadingTooltip {...tooltipProps}>
    <MenuItem {...menuItemProps}>{children}</MenuItem>
  </FadingTooltip>
);

WrappedMenuItem.propTypes = {
  tooltipProps: PropTypes.object,
  menuItemProps: PropTypes.object,
  children: PropTypes.node,
};

export const DeleteScenarioMenuItem = ({ scenario }) => {
  const { t } = useTranslation();
  const { askConfirmationToDeleteDialog } = useDeleteScenarioBatchButton();
  const isDisabled = scenario.canBeDeleted !== true;

  return (
    <WrappedMenuItem
      tooltipProps={{
        title: isDisabled
          ? t(
              'commoncomponents.scenariomanager.table.rowAction.cannotDeleteTooltip',
              'You do not have the required permissions to delete this scenario'
            )
          : '',
        disableInteractive: true,
      }}
      menuItemProps={{
        'data-cy': 'scenario-delete-menu-item',
        onClick: (event) => askConfirmationToDeleteDialog(event, [scenario.id]),
        disabled: isDisabled,
        sx: { color: (theme) => theme.palette.error.main },
      }}
    >
      <Stack spacing={2} direction="row">
        <DeleteForeverIcon color="error" size="small" />
        <Typography>{t('commoncomponents.scenariomanager.table.rowAction.delete', 'Delete')}</Typography>
      </Stack>
    </WrappedMenuItem>
  );
};

DeleteScenarioMenuItem.propTypes = {
  scenario: PropTypes.object,
};
