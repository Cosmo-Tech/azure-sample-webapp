// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/styles';
import { useSimulationViewContext } from '../../SimulationViewContext';
import { createApp, destroyApp, initApp, renderElements } from '../../utils/pixiUtils';

const Scene = ({ setSelectedElement }) => {
  const theme = useTheme();
  const { graphRef, resetGraphLayout, setCenterToPosition, needsReRendering } = useSimulationViewContext();

  const appRef = useRef(null);
  const containerRef = useRef(null);
  const sceneContainerRef = useRef(null);

  useEffect(() => {
    appRef.current = createApp();

    const setup = async () => {
      resetGraphLayout(containerRef.current.clientWidth, containerRef.current.clientHeight);
      await initApp(appRef, containerRef, sceneContainerRef, graphRef, resetGraphLayout, theme, setSelectedElement);
    };
    setup();

    return () => {
      destroyApp(appRef.current);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      sceneContainerRef.current.destroy(containerRef);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    resetGraphLayout(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderElements(sceneContainerRef, containerRef, graphRef, setSelectedElement);
  }, [needsReRendering, sceneContainerRef, containerRef, graphRef, setSelectedElement, resetGraphLayout]);

  const centerToPosition = useCallback(
    () => (x, y) => {
      if (sceneContainerRef.current == null) return;
      sceneContainerRef.current.translateTo(x, y);
    },
    [sceneContainerRef]
  );

  useEffect(() => {
    setCenterToPosition(centerToPosition);
  }, [centerToPosition, setCenterToPosition]);

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
