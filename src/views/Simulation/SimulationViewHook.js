// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useEffect, useRef, useState } from 'react';
import { useCurrentScenarioId } from '../../state/hooks/ScenarioHooks';
import bottlenecks from './data/bottlenecks.json';
import flowchartInstance from './data/graph.json';
import shortages from './data/shortages.json';
import { getGraphFromInstance, resetGraphLayout as resetLayout } from './utils/graphUtils';

const DEFAULT_SETTINGS = {
  orientation: 'horizontal',
  showInput: true,
  inputLevels: 2,
  showOutput: true,
  outputLevels: 2,
  spacing: 50,
};

export const useSimulationView = () => {
  const currentScenarioId = useCurrentScenarioId();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [needsReRendering, setNeedsReRendering] = useState(false);

  const [centerToPosition, setCenterToPosition] = useState(() => {});
  const graphRef = useRef(null);

  useEffect(() => {
    graphRef.current = getGraphFromInstance(flowchartInstance, bottlenecks, shortages, settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScenarioId]); // Do not reload graph data when settings change

  const resetGraphLayout = useCallback(
    (width, height) => {
      resetLayout(graphRef, width, height, settings);

      setNeedsReRendering(true);
    },
    [graphRef, settings]
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
