// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useEffect, useRef, useState } from 'react';
import { useCurrentScenarioId } from '../../state/hooks/ScenarioHooks';
import { DEFAULT_SETTINGS } from './constants/settings';
import bottlenecks from './data/bottlenecks.json';
import flowchartInstance from './data/graph.json';
import kpis from './data/kpis.json';
import shortages from './data/shortages.json';
import stockDemands from './data/stock_demands.json';
import { getGraphFromInstance, resetGraphHighlighting, resetGraphLayout as resetLayout } from './utils/graphUtils';

export const DEFAULT_UPDATE_STATE = {
  all: false,
  highlight: false,
  layout: false,
  render: false,
};

export const useSimulationView = () => {
  const currentScenarioId = useCurrentScenarioId();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [needsReRendering, setNeedsReRendering] = useState(false);
  const requiredUpdateStepsRef = useRef({ ...DEFAULT_UPDATE_STATE });

  const [centerToPosition, setCenterToPosition] = useState(() => {});
  const graphRef = useRef(null);

  useEffect(() => {
    if (graphRef.current != null) return;
    requiredUpdateStepsRef.current.layout = true;
    graphRef.current = getGraphFromInstance(flowchartInstance, bottlenecks, shortages, stockDemands, kpis, settings);
    setNeedsReRendering(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!graphRef.current) return;

    if (requiredUpdateStepsRef.current.all || requiredUpdateStepsRef.current.layout)
      graphRef.current = getGraphFromInstance(flowchartInstance, bottlenecks, shortages, stockDemands, kpis, settings);
    else if (requiredUpdateStepsRef.current.highlight) resetGraphHighlighting(graphRef.current, settings);

    setNeedsReRendering(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentScenarioId,
    settings.graphViewFilters,
    settings.showInput,
    settings.inputLevels,
    settings.showOutput,
    settings.outputLevels,
    settings.orientation,
    settings.spacing,
  ]);

  const resetGraphLayout = useCallback(
    (width, height) => {
      resetLayout(graphRef, width, height, settings);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [graphRef, settings.orientation, settings.spacing]
  );

  return {
    settings,
    setSettings,
    graphRef,
    resetGraphLayout,
    centerToPosition,
    setCenterToPosition,
    needsReRendering,
    setNeedsReRendering,
    requiredUpdateStepsRef,
  };
};
