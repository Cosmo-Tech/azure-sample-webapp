// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = theme => ({
  root: {
    margin: 'auto',
    width: '100%'
  }
});

const DataModel = (props) => {
  return (
      <div className={props.classes.root}>
        DATA MODEL
      </div>
  );
};

DataModel.propTypes = {
  classes: PropTypes.any
};

export default withStyles(useStyles)(DataModel);
