// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useRef, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { InspectorDrawer, Kpis, Scene, TopBar } from './components';

const Simulation = () => {
  const inspectorDrawerParentContainerRef = useRef(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const clearSelection = useCallback(() => setSelectedElement(null), [setSelectedElement]);

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%', width: '100%', overflowX: 'clip' }}
    >
      <div style={{ width: selectedElement != null ? '100%' : '0px' }}></div>
      <TopBar />
      <Grid container wrap="nowrap" direction="column" gap={1} style={{ height: '100%' }}>
        <Grid item xs>
          <Kpis />
        </Grid>
        <Grid item xs={12}>
          <div id="drawer-container" style={{ position: 'relative', height: '100%' }}>
            <Scene setSelectedElement={setSelectedElement} />
            <InspectorDrawer
              selectedElement={selectedElement}
              clearSelection={clearSelection}
              containerRef={inspectorDrawerParentContainerRef}
            />
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Simulation;
