// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Typography } from '@mui/material';
import { grey, lime, green, red } from '@mui/material/colors';
import { useGetTranslatedRunnerLastRunStatus } from '../../../state/runner/hooks';
import { RunnersUtils } from '../../../utils';

const RUN_STATUS_DOT_COLORS = {
  notstarted: grey[800],
  running: lime[600],
  successful: green[600],
  failed: red[600],
  unknown: grey[50],
};

export const ScenarioRunStatusCell = ({ scenario }) => {
  const getTranslatedRunnerLastRunStatus = useGetTranslatedRunnerLastRunStatus();

  const { dotElement, runStatusElement } = useMemo(() => {
    const statusLabel = getTranslatedRunnerLastRunStatus(scenario?.id);
    const runStatusElement = (
      <Typography
        data-cy="scenario-run-status"
        variant="body2"
        sx={{ maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {statusLabel}
      </Typography>
    );

    const status = RunnersUtils.getLastRunStatus(scenario);
    const dotColor = RUN_STATUS_DOT_COLORS?.[status.toLowerCase()] ?? RUN_STATUS_DOT_COLORS.unknown;
    const style = { bgcolor: dotColor, width: 8, height: 8, borderRadius: '50%' };
    const dotElement = <Box component="span" sx={{ ...style }} />;
    return { dotElement, runStatusElement };
  }, [getTranslatedRunnerLastRunStatus, scenario]);

  return (
    <Grid container wrap="nowrap" direction="row" spacing={1} sx={{ alignItems: 'center', height: '100%' }}>
      {dotElement}
      {runStatusElement}
    </Grid>
  );
};

ScenarioRunStatusCell.propTypes = {
  scenario: PropTypes.object,
};
