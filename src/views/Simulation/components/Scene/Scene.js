// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/styles';
import flowchartInstance from '../../data/output.json';
import { createApp, destroyApp } from '../../utils/pixiUtils';

const Scene = ({ setSelectedElement }) => {
  const theme = useTheme();
  const appRef = useRef(null);
  const containerRef = useRef(null);
  const sceneContainerRef = useRef(null);

  useEffect(() => {
    const setup = async () => {
      appRef.current = await createApp(containerRef, sceneContainerRef, flowchartInstance, theme, setSelectedElement);
    };
    setup();

    return () => destroyApp(appRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      data-cy="pixi-d3-view"
      ref={containerRef}
      style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
    ></div>
  );
};

Scene.propTypes = {
  setSelectedElement: PropTypes.func.isRequired,
};

export default Scene;
