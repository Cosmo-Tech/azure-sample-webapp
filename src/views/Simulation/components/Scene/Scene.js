// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/styles';
import { useSimulationViewContext } from '../../SimulationViewContext';
import { createApp, destroyApp, initApp, initMinimap, renderElements } from '../../utils/pixiUtils';
import { Minimap } from './Minimap';

const Scene = ({ setSelectedElement }) => {
  const theme = useTheme();
  const { graphRef, resetGraphLayout, setCenterToPosition, needsReRendering, settings } = useSimulationViewContext();

  const sceneAppRef = useRef(null);
  const minimapAppRef = useRef(null);
  const minimapContainerRef = useRef(null);
  const sceneCanvasRef = useRef(null);
  const minimapCanvasRef = useRef(null);
  const sceneContainerRef = useRef(null);

  const [, forceRender] = useState(0);

  useEffect(() => {
    sceneAppRef.current = createApp();
    minimapAppRef.current = createApp();

    const setup = async () => {
      resetGraphLayout(sceneCanvasRef.current.clientWidth, sceneCanvasRef.current.clientHeight);
      await initApp(
        sceneAppRef,
        sceneCanvasRef,
        sceneContainerRef,
        graphRef,
        resetGraphLayout,
        theme,
        setSelectedElement,
        settings
      );

      await initMinimap(minimapAppRef, minimapContainerRef, minimapCanvasRef, sceneContainerRef, theme);

      forceRender((prev) => prev + 1);
    };
    setup();

    return () => {
      destroyApp(sceneAppRef.current);
      destroyApp(minimapAppRef.current);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      sceneContainerRef.current.destroy(sceneCanvasRef);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    resetGraphLayout(sceneCanvasRef.current.clientWidth, sceneCanvasRef.current.clientHeight);
    if (sceneContainerRef.current) sceneContainerRef.current.removeChildren();
    renderElements(sceneContainerRef.current, graphRef, setSelectedElement, settings);
    if (minimapContainerRef.current != null) minimapContainerRef.current?.renderElements();
  }, [needsReRendering, sceneContainerRef, sceneCanvasRef, graphRef, setSelectedElement, resetGraphLayout, settings]);

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
    <>
      <div
        data-cy="pixi-d3-view"
        ref={sceneCanvasRef}
        style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
      ></div>
      <Minimap ref={minimapCanvasRef} sceneContainer={sceneContainerRef.current} />
    </>
  );
};

Scene.propTypes = {
  setSelectedElement: PropTypes.func.isRequired,
};

export default Scene;
