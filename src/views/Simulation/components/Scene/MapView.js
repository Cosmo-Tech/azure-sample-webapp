import React, { useEffect, useRef } from 'react';

const MapView = () => {
  const mapCanvasRef = useRef(null);
  const mapAppRef = useRef(null);

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

  return <div ref={mapCanvasRef} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }} />;
};

export default MapView;
