// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/styles';
import '@pixi/unsafe-eval';
import { createApp, renderElements } from './pixiUtils';

const SceneContainer = ({ toggleInspectorDrawer }) => {
  const theme = useTheme();

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const appCleanupFunction = createApp(appRef, canvasRef, containerRef, theme, toggleInspectorDrawer);
    renderElements(appRef, toggleInspectorDrawer);

    return appCleanupFunction;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ height: '100%', backgroundColor: '#000000', textAlign: 'center' }}>
      <div
        data-cy="pixi-d3-view"
        ref={containerRef}
        style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <div ref={canvasRef} style={{ flex: 1, width: '100%', position: 'relative', overflow: 'hidden' }}></div>
      </div>
    </div>
  );
};

SceneContainer.propTypes = {
  toggleInspectorDrawer: PropTypes.func.isRequired,
};

export default SceneContainer;
