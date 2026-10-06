// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback } from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ErrorIcon from '@mui/icons-material/Error';
import HelpIcon from '@mui/icons-material/Help';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { grey, lime, green, red } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import { RUNNER_RUN_STATE } from '../../services/config/ApiConstants';
import { useApplicationTheme } from '../../state/app/hooks';
import { useGetRunnerById, useGetRunStatusLabel } from '../../state/runner/hooks';
import { RunnersUtils } from '../../utils';

const RUN_STATUS_BADGE_ICONS = {
  notstarted: <AutoAwesomeIcon />,
  successful: <PlayCircleIcon />,
  running: <HourglassFullIcon />,
  failed: <ErrorIcon />,
  unknown: <HelpIcon />,
};

const RUN_STATUS_BADGE_COLORS = {
  dark: {
    notstarted: grey[800],
    successful: green[600],
    running: lime[600],
    failed: red[400],
    unknown: grey[50],
  },
  light: {
    notstarted: grey[200],
    successful: green[200],
    running: lime[200],
    failed: red[200],
    unknown: grey[600],
  },
};

export const useScenarioRunStateChip = (scenarioId) => {
  const { isDarkTheme } = useApplicationTheme();
  const theme = useTheme();
  const getRunnerById = useGetRunnerById(); // Note: this component only supports simulation runners, not ETL runners
  const getRunStatusLabel = useGetRunStatusLabel();

  const getScenarioRunState = useCallback(
    (runnerId) => {
      const runner = getRunnerById(runnerId);
      const status = runner != null ? RunnersUtils.getLastRunStatus(runner) : RUNNER_RUN_STATE.UNKNOWN;
      const label = getRunStatusLabel(status);
      const icon = RUN_STATUS_BADGE_ICONS[status?.toLowerCase()];

      const themeKey = isDarkTheme ? 'dark' : 'light';
      const backgroundColor = RUN_STATUS_BADGE_COLORS[themeKey][status?.toLowerCase()];
      const textColor = theme.palette.getContrastText(backgroundColor);

      return { status, label, icon, backgroundColor, textColor };
    },
    [getRunnerById, getRunStatusLabel, isDarkTheme, theme.palette]
  );

  return { getScenarioRunState };
};
