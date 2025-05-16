// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid } from '@mui/material';
import MainPixiScene from './MainPixiScene';

const SceneContainer = ({ toggleInspectorDrawer }) => {
  return (
    <div style={{ height: '100%', backgroundColor: '#000000', textAlign: 'center' }}>
      <Grid container direction="column" gap={4} justifyContent="center" style={{ height: '100%' }}>
        <Grid item>
          <MainPixiScene />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={toggleInspectorDrawer}>
            [WIP] toggle drawer
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

SceneContainer.propTypes = {
  toggleInspectorDrawer: PropTypes.func.isRequired,
};

export default SceneContainer;
