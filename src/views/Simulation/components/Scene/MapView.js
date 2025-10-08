// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useRef, useState } from 'react';
import { Minimap } from './Minimap';
import { IncidentChip } from './components/IncidentChip';

const MapView = () => {
  const mapCanvasRef = useRef(null);
  const mapAppRef = useRef(null);
  const minimapCanvasRef = useRef(null);
  const sceneContainerRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const [hoveredIncident, setHoveredIncident] = useState({
    visible: false,
    position: { x: 0, y: 0 },
    data: { bottlenecks: 0, shortages: 0 },
  });

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
      <IncidentChip position={hoveredIncident.position} data={hoveredIncident.data} visible={hoveredIncident.visible} />
      <Minimap ref={minimapCanvasRef} sceneContainerRef={sceneContainerRef} />
    </>
  );
};

export default MapView;
