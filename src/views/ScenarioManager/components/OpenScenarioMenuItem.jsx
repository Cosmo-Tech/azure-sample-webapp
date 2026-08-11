// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { MenuItem, Stack, Typography } from '@mui/material';
import { useWorkspaceId } from '../../../state/workspaces/hooks';

export const OpenScenarioMenuItem = ({ scenarioId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const workspaceId = useWorkspaceId();

  const onOpenScenario = useCallback(
    (scenarioId) => navigate(`/${workspaceId}/scenario/${scenarioId}`),
    [navigate, workspaceId]
  );

  return (
    <MenuItem data-cy="open-scenario-button" onClick={() => onOpenScenario(scenarioId)} disabled={!scenarioId}>
      <Stack spacing={2} direction="row">
        <OpenInNewIcon size="small" />
        <Typography>{t('commoncomponents.scenariomanager.table.rowAction.open', 'Open')}</Typography>
      </Stack>
    </MenuItem>
  );
};

OpenScenarioMenuItem.propTypes = {
  scenarioId: PropTypes.string.required,
};
