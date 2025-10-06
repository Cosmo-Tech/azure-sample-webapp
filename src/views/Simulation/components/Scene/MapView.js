// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useRef } from 'react';
import { Minimap } from './Minimap';

const MapView = () => {
  const mapCanvasRef = useRef(null);
  const mapAppRef = useRef(null);
  const minimapCanvasRef = useRef(null);
  const sceneContainerRef = useRef(null);

  useEffect(() => {
    if (!mapCanvasRef.current) return;

    const appInstance = mapAppRef.current;

    return () => {
      if (appInstance) {
        appInstance.destroy(true, { children: true });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div ref={mapCanvasRef} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }} />
      <Minimap ref={minimapCanvasRef} sceneContainerRef={sceneContainerRef} />
    </>
  );
};

export default MapView;
