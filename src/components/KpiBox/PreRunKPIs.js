// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material';
import { KPIGroup } from './KpiGroup';

export const PreRunKPIs = ({ items, status }) => {
  const theme = useTheme();

  return <KPIGroup items={items} status={status} background={theme.palette.neutral.neutral04.main} border={true} />;
};

PreRunKPIs.propTypes = {
  items: PropTypes.array.isRequired,
  status: PropTypes.string,
};
