// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import { DateRangeOutlined as DateRangeOutlinedIcon } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';
import { useSimulationViewContext } from '../../SimulationViewContext';

const parseDateWithoutTimezoneOffset = (dateString) => {
  const date = new Date(dateString);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
};

const parseAndFormatDateString = (dateString) => {
  return parseDateWithoutTimezoneOffset(dateString).toISOString().substring(0, 10);
};

export const SimulationHorizon = () => {
  const { graphRef } = useSimulationViewContext();

  const horizonText = useMemo(() => {
    const config = graphRef.current?.simulationConfiguration;
    if (config == null || config.startingDate == null || config.endDate == null) return 'N/A';
    return `${parseAndFormatDateString(config.startingDate)} - ${parseAndFormatDateString(config.endDate)}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphRef, graphRef.current?.simulationConfiguration]);

  return (
    <TextField
      disabled={true}
      label="Simulation horizon"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <DateRangeOutlinedIcon color="disabled" />
          </InputAdornment>
        ),
      }}
      value={horizonText}
      variant="outlined"
    />
  );
};
