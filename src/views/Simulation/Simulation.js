// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { InspectorDrawer, Kpis, SceneContainer, TopBar } from './components';

const useStyles = makeStyles((theme) => ({
  viewContainer: {
    height: '100%',
    width: '100%',
  },
}));

const Simulation = () => {
  const classes = useStyles();

  const [isInspectorDrawerOpen, setIsInspectorDrawerOpen] = useState(false);
  // const openInspectorDrawer = () => setIsInspectorDrawerOpen(true);
  const closeInspectorDrawer = () => setIsInspectorDrawerOpen(false);
  const toggleInspectorDrawer = (previousValue) => setIsInspectorDrawerOpen(previousValue);

  return (
    <Box sx={{ flexGrow: 1 }} className={classes.viewContainer}>
      <Grid container wrap="nowrap" direction="column" gap={1} style={{ height: '100%' }}>
        <Grid item xs>
          <TopBar />
        </Grid>
        <Grid item xs>
          <div>
            <InspectorDrawer open={isInspectorDrawerOpen} onClose={closeInspectorDrawer} />
            <Kpis />
          </div>
        </Grid>
        <Grid item xs={12}>
          <SceneContainer toggleInspectorDrawer={toggleInspectorDrawer} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Simulation;
