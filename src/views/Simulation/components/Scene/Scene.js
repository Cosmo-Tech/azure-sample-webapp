// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useEffect, useRef } from 'react';
import { useTheme } from '@mui/styles';
import { useSimulationViewContext } from '../../SimulationViewContext';
import { DEFAULT_UPDATE_STATE } from '../../SimulationViewHook';
import { simulationTheme } from '../../theme';
import { resetGraphHighlighting } from '../../utils/graphUtils';
import {
  createApp,
  destroyApp,
  initGraphApp,
  initMinimap,
  generateTextures,
  renderElements,
  updateContainerSprites,
} from '../../utils/pixiUtils';
import { ChartTimeline } from '../Charts';
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
    currentTimestep,
    timelineMarkers,
    currentScenario,
  } = useSimulationViewContext();

  const sceneAppRef = useRef(null);
  const minimapAppRef = useRef(null);
  const minimapContainerRef = useRef(null);
  const graphCanvasRef = useRef(null);
  const minimapCanvasRef = useRef(null);
  const sceneContainerRef = useRef(null);
  const sampleMarkers = timelineMarkers;

  useEffect(() => {
    sceneAppRef.current = createApp();
    minimapAppRef.current = createApp();

    const setup = async () => {
      resetGraphLayout(graphCanvasRef.current.clientWidth, graphCanvasRef.current.clientHeight);
      await initGraphApp(
        sceneAppRef,
        graphCanvasRef,
        sceneContainerRef,
        graphRef,
        theme,
        setSelectedElementId,
        settings
      );

      await initMinimap(minimapAppRef, minimapContainerRef, minimapCanvasRef, sceneContainerRef, graphCanvasRef, theme);
    };
    setup();

    return () => {
      destroyApp(sceneAppRef.current);
      destroyApp(minimapAppRef.current);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      sceneContainerRef.current.destroy(graphCanvasRef);
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
    if (!sceneContainerRef.current || !graphRef.current) return;

    resetGraphHighlighting(graphRef.current, settings, selectedElementId, currentTimestep);
    updateContainerSprites(sceneContainerRef.current, graphRef.current);
    if (minimapContainerRef.current) minimapContainerRef.current.updateMiniScene();
  }, [currentTimestep, settings, graphRef, selectedElementId, sceneContainerRef]);

  useEffect(() => {
    if (!needsReRendering) return;

    const layoutUpdate = requiredUpdateStepsRef.current.all || requiredUpdateStepsRef.current.layout;
    if (layoutUpdate) {
      resetGraphLayout(graphCanvasRef.current.clientWidth, graphCanvasRef.current.clientHeight);
    }
    if (requiredUpdateStepsRef.current.all) setSelectedElementId(null);

    if (
      requiredUpdateStepsRef.current.all ||
      requiredUpdateStepsRef.current.highlight ||
      requiredUpdateStepsRef.current.layout ||
      requiredUpdateStepsRef.current.paletteMode ||
      requiredUpdateStepsRef.current.render
    ) {
      const palette = simulationTheme[theme.palette.mode];

      if (sceneContainerRef.current) {
        sceneContainerRef.current.removeChildren().forEach((child) => {
          child.destroy({
            children: true,
            texture: requiredUpdateStepsRef.current.paletteMode,
            baseTexture: requiredUpdateStepsRef.current.paletteMode,
          });
        });
        if (requiredUpdateStepsRef.current.paletteMode)
          sceneContainerRef.current.textures = generateTextures(sceneAppRef.current, palette);
      }

      const resetBounds = requiredUpdateStepsRef.current.all || requiredUpdateStepsRef.current.layout;
      renderElements(sceneContainerRef, graphRef, sceneAppRef, setSelectedElementId, settings, theme, resetBounds);
      if (layoutUpdate && sceneContainerRef.current) sceneContainerRef.current.setOrigin();
      if (minimapContainerRef.current) {
        minimapContainerRef.current.createNodeTextures(palette);
        minimapContainerRef.current.renderElements(palette);
      }
    }

    requiredUpdateStepsRef.current = { ...DEFAULT_UPDATE_STATE };
    setNeedsReRendering(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    needsReRendering,
    selectedElementId,
    setNeedsReRendering,
    sceneContainerRef,
    sceneContainerRef?.current?.textures,
    graphCanvasRef?.current?.clientWidth,
    graphCanvasRef?.current?.clientHeight,
    graphRef,
    setSelectedElementId,
    resetGraphLayout,
    graphRef.current,
    currentScenario?.id,
  ]);

  return (
    <>
      <div
        data-cy="graph-view"
        ref={graphCanvasRef}
        style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
      ></div>
      <ChartTimeline
        chartData={graphRef.current?.totalStockDemand}
        markers={sampleMarkers}
        startDate={new Date(graphRef.current?.simulationConfiguration?.startingDate)}
        endDate={new Date(graphRef.current?.simulationConfiguration?.endDate)}
      />
      <Minimap ref={minimapCanvasRef} sceneContainerRef={sceneContainerRef} />
    </>
  );
};

export default Scene;
