// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  label: {
    color: theme.palette.text.secondary,
  },
}));

const MetadataLabel = (props) => {
  const classes = useStyles();
  const { label } = props;
  return (
    <Typography variant="body1" className={classes.label} sx={{ pr: 1 }}>
      {label}:
    </Typography>
  );
};

MetadataLabel.propTypes = {
  label: PropTypes.string.isRequired,
};

export default MetadataLabel;
