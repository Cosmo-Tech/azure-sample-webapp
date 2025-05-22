// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/styles';
import flowchartInstance from '../../data/output.json';
import { createApp, destroyApp } from './pixiUtils';

const SceneContainer = ({ toggleInspectorDrawer }) => {
  const theme = useTheme();
  const appRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const setup = async () => {
      appRef.current = await createApp(containerRef, flowchartInstance, theme, toggleInspectorDrawer);
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

SceneContainer.propTypes = {
  toggleInspectorDrawer: PropTypes.func.isRequired,
};

export default SceneContainer;
