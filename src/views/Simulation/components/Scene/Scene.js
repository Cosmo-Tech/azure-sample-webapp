// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/styles';
import { useSimulationViewContext } from '../../SimulationViewContext';
import { DEFAULT_UPDATE_STATE } from '../../SimulationViewHook';
import { createApp, destroyApp, initApp, initMinimap, renderElements } from '../../utils/pixiUtils';
import { Minimap } from './Minimap';

const Scene = ({ setSelectedElement }) => {
  const theme = useTheme();
  const {
    graphRef,
    resetGraphLayout,
    setCenterToPosition,
    needsReRendering,
    requiredUpdateStepsRef,
    setNeedsReRendering,
    settings,
  } = useSimulationViewContext();

  const sceneAppRef = useRef(null);
  const minimapAppRef = useRef(null);
  const minimapContainerRef = useRef(null);
  const sceneCanvasRef = useRef(null);
  const minimapCanvasRef = useRef(null);
  const sceneContainerRef = useRef(null);

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

      await initMinimap(minimapAppRef, minimapContainerRef, minimapCanvasRef, sceneContainerRef, sceneCanvasRef, theme);
    };
    setup();

    return () => {
      destroyApp(sceneAppRef.current);
      destroyApp(minimapAppRef.current);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      sceneContainerRef.current.destroy(sceneCanvasRef);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      minimapContainerRef.current.destroy(minimapCanvasRef);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!needsReRendering) return;
    if (requiredUpdateStepsRef.current.all || requiredUpdateStepsRef.current.layout) {
      resetGraphLayout(sceneCanvasRef.current.clientWidth, sceneCanvasRef.current.clientHeight);
    }

    if (
      requiredUpdateStepsRef.current.all ||
      requiredUpdateStepsRef.current.highlight ||
      requiredUpdateStepsRef.current.layout ||
      requiredUpdateStepsRef.current.render
    ) {
      if (sceneContainerRef.current) sceneContainerRef.current.removeChildren();
      renderElements(sceneContainerRef, graphRef, setSelectedElement, settings);
      if (minimapContainerRef.current != null) minimapContainerRef.current?.renderElements();
    }

    requiredUpdateStepsRef.current = { ...DEFAULT_UPDATE_STATE };
    setNeedsReRendering(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    needsReRendering,
    setNeedsReRendering,
    sceneContainerRef,
    sceneContainerRef?.current?.textures,
    sceneCanvasRef?.current?.clientWidth,
    sceneCanvasRef?.current?.clientHeight,
    graphRef,
    setSelectedElement,
    resetGraphLayout,
    graphRef.current,
  ]);

  const centerToPosition = useCallback(
    () => (elementId) => {
      if (sceneContainerRef.current == null) return;
      sceneContainerRef.current.centerOnElement(elementId);
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
      <Minimap ref={minimapCanvasRef} sceneContainerRef={sceneContainerRef} />
    </>
  );
};

Scene.propTypes = {
  setSelectedElement: PropTypes.func.isRequired,
};

export default Scene;
