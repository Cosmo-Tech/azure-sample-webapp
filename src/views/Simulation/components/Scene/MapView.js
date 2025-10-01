// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useRef } from 'react';
import { useTheme } from '@mui/styles';
import { createApp, initMapApp, destroyApp, generateMap } from '../../utils/pixiUtils';

const MapView = () => {
  const theme = useTheme();

  const mapCanvasRef = useRef(null);
  const mapAppRef = useRef(null);
  const mapContainerRef = useRef(null);

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
    <div
      data-cy="map-view"
      ref={mapCanvasRef}
      style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
    />
  );
};

export default MapView;
