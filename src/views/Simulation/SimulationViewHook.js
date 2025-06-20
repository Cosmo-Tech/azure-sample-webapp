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
import { getGraphFromInstance, resetGraphLayout as resetLayout } from './utils/graphUtils';

export const useSimulationView = () => {
  const currentScenarioId = useCurrentScenarioId();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [needsReRendering, setNeedsReRendering] = useState(false);

  const [centerToPosition, setCenterToPosition] = useState(() => {});
  const graphRef = useRef(null);

  useEffect(() => {
    // TODO: possible performance improvement if we can create a different useEffect to update only the highlighted
    // graph elements when filter settings change, instead of rebuilding the whole graph
    graphRef.current = getGraphFromInstance(flowchartInstance, bottlenecks, shortages, stockDemands, kpis, settings);
    setNeedsReRendering(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentScenarioId,
    // Do not reload graph data for all settings
    settings.graphViewFilters,
    settings.showInput,
    settings.inputLevels,
    settings.showOutput,
    settings.outputLevels,
  ]);

  const resetGraphLayout = useCallback(
    (width, height) => {
      resetLayout(graphRef, width, height, settings);
      setNeedsReRendering(true);
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
  };
};
