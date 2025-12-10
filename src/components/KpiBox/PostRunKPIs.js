// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material';
import { KPIGroup } from './KpiGroup';

export const PostRunKPIs = ({ items, status }) => {
  const theme = useTheme();

  return (
    <KPIGroup items={items} status={status} background={theme.palette.background.background01.main} border={false} />
  );
};

PostRunKPIs.propTypes = {
  items: PropTypes.array.isRequired,
  status: PropTypes.string,
};
