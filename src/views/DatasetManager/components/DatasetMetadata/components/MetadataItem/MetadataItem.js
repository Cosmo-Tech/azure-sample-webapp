// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import MetadataLabel from '../MetadataLabel';

const MetadataItem = (props) => {
  const { id, label, value, action } = props;

  return value != null ? (
    <Grid item data-cy={`dataset-metadata-${id}`}>
      <Grid
        container
        sx={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'nowrap' }}
      >
        <MetadataLabel label={label}></MetadataLabel>
        <Typography variant="body1">{value}</Typography>
        {action}
      </Grid>
    </Grid>
  ) : null;
};

MetadataItem.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  action: PropTypes.node,
};

MetadataItem.defaultProps = {
  id: 'item',
};

export default MetadataItem;
