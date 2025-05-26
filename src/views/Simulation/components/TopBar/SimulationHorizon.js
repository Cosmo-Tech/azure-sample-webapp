// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { DateRangeOutlined as DateRangeOutlinedIcon } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';

const formatDate = (date) => date.toISOString().substring(0, 10);

export const SimulationHorizon = ({ startDate, endDate }) => {
  const horizonText = useMemo(() => {
    const start = startDate ?? new Date();
    const end = endDate ?? new Date(new Date(start).setMonth(start.getMonth() + 1));
    return `${formatDate(start)} - ${formatDate(end)}`;
  }, [startDate, endDate]);

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

SimulationHorizon.propTypes = {
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
};
