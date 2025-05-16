// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useRef, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { InspectorDrawer, Kpis, SceneContainer, TopBar } from './components';

const Simulation = () => {
  const inspectorDrawerParentContainerRef = useRef(null);
  const [isInspectorDrawerOpen, setIsInspectorDrawerOpen] = useState(false);
  // const openInspectorDrawer = () => setIsInspectorDrawerOpen(true);
  const closeInspectorDrawer = () => setIsInspectorDrawerOpen(false);
  const toggleInspectorDrawer = () => setIsInspectorDrawerOpen((previousValue) => !previousValue);

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%', width: '100%', overflowX: 'clip' }}
    >
      <div style={{ width: isInspectorDrawerOpen ? '100%' : '0px' }}></div>
      <TopBar />
      <Grid container wrap="nowrap" direction="column" gap={1} style={{ height: '100%' }}>
        <Grid item xs>
          <Kpis />
        </Grid>
        <Grid item xs={12}>
          <div id="drawer-container" style={{ position: 'relative', height: '100%' }}>
            <SceneContainer toggleInspectorDrawer={toggleInspectorDrawer} />
            <InspectorDrawer
              open={isInspectorDrawerOpen}
              onClose={closeInspectorDrawer}
              containerRef={inspectorDrawerParentContainerRef}
            />
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Simulation;
