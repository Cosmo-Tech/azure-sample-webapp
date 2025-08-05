// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useEffect, useRef } from 'react';
import { useTheme } from '@mui/styles';
import { useSimulationViewContext } from '../../SimulationViewContext';
import { DEFAULT_UPDATE_STATE } from '../../SimulationViewHook';
import { createApp, destroyApp, initApp, initMinimap, renderElements } from '../../utils/pixiUtils';
import { Minimap } from './Minimap';

const Scene = () => {
  const theme = useTheme();
  const {
    graphRef,
    resetGraphLayout,
    setSelectedElementId,
    needsReRendering,
    requiredUpdateStepsRef,
    setNeedsReRendering,
    selectedElementId,
    settings,
    setCenterToPosition,
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
        setSelectedElementId,
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

  const centerToPosition = useCallback(
    () => (elementId) => {
      if (sceneContainerRef.current == null) return;
      const newSelectedElement = sceneContainerRef.current.findElementById(elementId);
      sceneContainerRef.current.centerOnElement(newSelectedElement);
    },
    [sceneContainerRef]
  );

  useEffect(() => {
    setCenterToPosition(centerToPosition);
  }, [centerToPosition, setCenterToPosition]);

  useEffect(() => {
    if (sceneContainerRef.current == null) return;
    requiredUpdateStepsRef.current.highlight = true;
  }, [selectedElementId, requiredUpdateStepsRef]);

  useEffect(() => {
    if (!needsReRendering) return;
    const layoutUpdate = requiredUpdateStepsRef.current.all || requiredUpdateStepsRef.current.layout;
    if (layoutUpdate) {
      resetGraphLayout(sceneCanvasRef.current.clientWidth, sceneCanvasRef.current.clientHeight);
    }
    if (requiredUpdateStepsRef.current.all) setSelectedElementId(null);

    if (
      requiredUpdateStepsRef.current.all ||
      requiredUpdateStepsRef.current.highlight ||
      requiredUpdateStepsRef.current.layout ||
      requiredUpdateStepsRef.current.render
    ) {
      if (sceneContainerRef.current) sceneContainerRef.current.removeChildren();
      renderElements(sceneContainerRef, graphRef, setSelectedElementId, settings);
      if (layoutUpdate && sceneContainerRef.current) sceneContainerRef.current.setOrigin();
      if (minimapContainerRef.current) minimapContainerRef.current.renderElements();
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
    setSelectedElementId,
    resetGraphLayout,
    graphRef.current,
  ]);

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

export default Scene;
