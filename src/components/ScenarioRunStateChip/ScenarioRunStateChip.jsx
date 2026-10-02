// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Chip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useScenarioRunStateChip } from './ScenarioRunStateChipHook';

const ScenarioRunStateChip = ({ scenarioId }) => {
  const { getScenarioRunState } = useScenarioRunStateChip(scenarioId);

  const { status, key, label, icon, backgroundColor, textColor } = useMemo(() => {
    const { status, label, icon, backgroundColor, textColor } = getScenarioRunState(scenarioId);
    const key = `run-state-chip-${status?.toLowerCase()}-${scenarioId}`;
    return { status, key, label, icon, backgroundColor, textColor };
  }, [getScenarioRunState, scenarioId]);

  if (scenarioId == null || status == null) return null;
  return (
    <Chip
      key={key}
      label={label}
      icon={icon}
      data-cy={key}
      color="primary"
      sx={{
        '& .MuiChip-icon': {
          color: alpha(textColor, 0.55),
        },
      }}
      style={{ color: textColor, backgroundColor }}
    />
  );
};

ScenarioRunStateChip.propTypes = {
  scenarioId: PropTypes.string,
};

export default ScenarioRunStateChip;
