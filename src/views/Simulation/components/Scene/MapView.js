// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useRef } from 'react';
import { useTheme } from '@mui/styles';
import { createApp, initMapApp } from '../../utils/pixiUtils';

const MapView = () => {
  const theme = useTheme();

  const mapCanvasRef = useRef(null);
  const mapAppRef = useRef(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const mapApp = mapAppRef.current;
    mapAppRef.current = createApp();
    const setup = async () => {
      await initMapApp(mapAppRef, mapCanvasRef, mapContainerRef, theme);
    };
    setup();
    return () => {
      if (mapApp) {
        mapApp.destroy(true, { children: true });
      }
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
