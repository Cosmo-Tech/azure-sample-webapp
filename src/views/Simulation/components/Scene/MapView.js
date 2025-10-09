// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/styles';
import { createApp, initMapApp, destroyApp, generateMap } from '../../utils/pixiUtils';
import { IncidentChip } from './components/IncidentChip';

const MapView = () => {
  const theme = useTheme();
  const mapContainerRef = useRef(null);
  const mapCanvasRef = useRef(null);
  const mapAppRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const [hoveredIncident, setHoveredIncident] = useState({
    visible: false,
    position: { x: 0, y: 0 },
    data: { bottlenecks: 0, shortages: 0 },
  });

  useEffect(() => {
    mapAppRef.current = createApp();
    const setup = async () => {
      await initMapApp(mapAppRef, mapCanvasRef, mapContainerRef, theme);
      generateMap(mapContainerRef, mapCanvasRef);
    };
    setup();

    return () => {
      destroyApp(mapAppRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        data-cy="map-view"
        ref={mapCanvasRef}
        style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
      />
      <IncidentChip position={hoveredIncident.position} data={hoveredIncident.data} visible={hoveredIncident.visible} />
    </>
  );
};

export default MapView;
