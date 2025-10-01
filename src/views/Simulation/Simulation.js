// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useRef } from 'react';
import { Box, Grid } from '@mui/material';
import ModeSwitcher from './ModeSwitcher';
import { SimulationViewProvider, useSimulationViewContext } from './SimulationViewContext';
import { InspectorDrawer, Kpis, Scene, TopBar } from './components';
import MapView from './components/Scene/MapView';
import { SIMULATION_MODES } from './constants/settings';

const SimulationContent = () => {
  const inspectorDrawerParentContainerRef = useRef(null);
  const { viewMode, setViewMode } = useSimulationViewContext();

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%', width: '100%', overflowX: 'clip' }}
    >
      <TopBar />
      <Grid container wrap="nowrap" direction="column" gap={1} style={{ height: '100%' }}>
        <Grid item xs>
          <Kpis />
        </Grid>
        <Grid item xs={12}>
          <div id="drawer-container" style={{ position: 'relative', height: '100%' }}>
            {viewMode === SIMULATION_MODES.GRAPH ? <Scene /> : <MapView />}
            <InspectorDrawer containerRef={inspectorDrawerParentContainerRef} />
            <ModeSwitcher mode={viewMode} onChange={setViewMode} />
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

const Simulation = () => {
  return (
    <SimulationViewProvider>
      <SimulationContent />
    </SimulationViewProvider>
  );
};

export default Simulation;
