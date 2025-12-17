// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

const MetadataLabel = (props) => {
  const { label } = props;
  return (
    <Typography variant="body1" sx={{ pr: 1, color: (theme) => theme.palette.text.secondary }}>
      {label}:
    </Typography>
  );
};

MetadataLabel.propTypes = {
  label: PropTypes.string.isRequired,
};

export default MetadataLabel;
