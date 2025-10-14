// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useEffect, useRef } from 'react';
import { useTheme } from '@mui/styles';
import { useSimulationViewContext } from '../../SimulationViewContext';
import { DEFAULT_UPDATE_STATE } from '../../SimulationViewHook';
import { resetGraphHighlighting } from '../../utils/graphUtils';
import {
  createApp,
  destroyApp,
  initGraphApp,
  initMinimap,
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
  const graphCanvasRef = useRef(null); // DOM container for the main scene
  const minimapCanvasRef = useRef(null);
  const sceneContainerRef = useRef(null); // PIXI container instance
  const sampleMarkers = timelineMarkers;

  // Helper: read size safely
  const getCanvasSize = () => {
    const el = graphCanvasRef.current;
    if (!el) return null;
    const { clientWidth, clientHeight } = el;
    if (clientWidth == null || clientHeight == null) return null;
    return { clientWidth, clientHeight };
  };

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

    // Observe container resizes (e.g., panel open/close, window resize)
    let ro;
    if (typeof ResizeObserver !== 'undefined' && graphCanvasRef.current) {
      ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const cr = entry.contentRect;
          if (cr && cr.width && cr.height) {
            resetGraphLayout(Math.floor(cr.width), Math.floor(cr.height));
            // If you want to force a re-render cycle after resize, flip requiredUpdateStepsRef flags here
            requiredUpdateStepsRef.current.layout = true;
            setNeedsReRendering(true);
          }
        }
      });
      ro.observe(graphCanvasRef.current);
    }

    return () => {
      try {
        destroyApp(sceneAppRef.current);
      } catch {}
      try {
        destroyApp(minimapAppRef.current);
      } catch {}
      try {
        sceneContainerRef.current?.destroy(graphCanvasRef);
      } catch {}
      try {
        minimapContainerRef.current?.destroy(minimapCanvasRef);
      } catch {}
      if (ro && graphCanvasRef.current) {
        try {
          ro.unobserve(graphCanvasRef.current);
        } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const centerToPosition = useCallback(
    () => (elementId) => {
      if (!sceneContainerRef.current) return;
      const newSelectedElement = sceneContainerRef.current.findElementById(elementId);
      if (newSelectedElement) sceneContainerRef.current.centerOnElement(newSelectedElement);
    },
    []
  );

  useEffect(() => {
    setCenterToPosition(centerToPosition);
  }, [centerToPosition, setCenterToPosition]);

  useEffect(() => {
    if (!sceneContainerRef.current) return;
    requiredUpdateStepsRef.current.highlight = true;
  }, [selectedElementId, requiredUpdateStepsRef]);

  useEffect(() => {
    if (!sceneContainerRef.current || !graphRef.current) return;

    resetGraphHighlighting(graphRef.current, settings, selectedElementId, currentTimestep);
    updateContainerSprites(sceneContainerRef.current, graphRef.current);
    minimapContainerRef.current?.updateMiniScene();
  }, [currentTimestep, settings, graphRef, selectedElementId]);

  useEffect(() => {
    if (!needsReRendering) return;

    const layoutUpdate = requiredUpdateStepsRef.current.all || requiredUpdateStepsRef.current.layout;

    if (layoutUpdate) {
      const size = getCanvasSize();
      if (size) {
        resetGraphLayout(size.clientWidth, size.clientHeight);
      }
    }

    if (requiredUpdateStepsRef.current.all) setSelectedElementId(null);

    if (
      requiredUpdateStepsRef.current.all ||
      requiredUpdateStepsRef.current.highlight ||
      requiredUpdateStepsRef.current.layout ||
      requiredUpdateStepsRef.current.render
    ) {
      if (sceneContainerRef.current) {
        sceneContainerRef.current.removeChildren().forEach((child) => {
          child.destroy({ children: true, texture: false, baseTexture: false });
        });
      }

      const resetBounds = requiredUpdateStepsRef.current.all || requiredUpdateStepsRef.current.layout;
      renderElements(sceneContainerRef, graphRef, setSelectedElementId, settings, resetBounds);
      if (layoutUpdate && sceneContainerRef.current) sceneContainerRef.current.setOrigin();
      minimapContainerRef.current?.renderElements();
    }

    requiredUpdateStepsRef.current = { ...DEFAULT_UPDATE_STATE };
    setNeedsReRendering(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    needsReRendering,
    selectedElementId,
    setNeedsReRendering,
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
      />
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
