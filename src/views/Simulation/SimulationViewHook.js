// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useEffect, useRef, useState } from 'react';
import { DEFAULT_SETTINGS } from './constants/settings';
import { SCENARIO_DATA as SCENARIO3 } from './data/output-sr-mgmo6vqg7e2l';
import { SCENARIO_DATA as SCENARIO2 } from './data/output-sr-n59xj8roqgw';
import { SCENARIO_DATA as SCENARIO1 } from './data/output-sr-pm7247w4d5n';
import { getGraphFromInstance, resetGraphHighlighting, resetGraphLayout as resetLayout } from './utils/graphUtils';

export const DEFAULT_UPDATE_STATE = {
  all: false,
  highlight: false,
  layout: false,
  render: false,
};

export const FAKE_SCENARIOS_METADATA = [
  { id: 's-001', name: 'Inventory Optimization 1', lastRunId: 'sr-pm7247w4d5n', parentId: null },
  { id: 's-002', name: 'Inventory Optimization 2', lastRunId: 'sr-n59xj8roqgw', parentId: 's-001' },
  { id: 's-003', name: 'Maxi Demo', lastRunId: 'sr-mgmo6vqg7e2l', parentId: null },
];

export const FAKE_SCENARIOS_DATA = {
  [FAKE_SCENARIOS_METADATA[0].lastRunId]: SCENARIO1,
  [FAKE_SCENARIOS_METADATA[1].lastRunId]: SCENARIO2,
  [FAKE_SCENARIOS_METADATA[2].lastRunId]: SCENARIO3,
};

export const useSimulationView = () => {
  const scenarios = FAKE_SCENARIOS_METADATA;
  const [currentScenario, setCurrentScenario] = useState(scenarios?.[0]);

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [needsReRendering, setNeedsReRendering] = useState(false);
  const requiredUpdateStepsRef = useRef({ ...DEFAULT_UPDATE_STATE });

  const [selectedElementId, setSelectedElementId] = useState(null);
  const [centerToPosition, setCenterToPosition] = useState(() => {});

  const graphRef = useRef(null);
  const lastScenarioId = useRef(null);

  useEffect(() => {
    if (graphRef.current != null) return;
    lastScenarioId.current = currentScenario?.id;
    requiredUpdateStepsRef.current.layout = true;

    const lastRunId = currentScenario.lastRunId;
    const scenarioInstanceData = FAKE_SCENARIOS_DATA?.[lastRunId];
    graphRef.current = getGraphFromInstance(scenarioInstanceData, settings);
    setNeedsReRendering(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!graphRef.current) return;

    if (lastScenarioId.current !== currentScenario?.id) {
      lastScenarioId.current = currentScenario?.id;
      requiredUpdateStepsRef.current.all = true;
    }

    if (requiredUpdateStepsRef.current.all || requiredUpdateStepsRef.current.layout) {
      const lastRunId = currentScenario.lastRunId;
      const scenarioInstanceData = FAKE_SCENARIOS_DATA?.[lastRunId];
      graphRef.current = getGraphFromInstance(scenarioInstanceData, settings);
    } else if (requiredUpdateStepsRef.current.highlight) resetGraphHighlighting(graphRef.current, settings);

    setNeedsReRendering(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentScenario?.id,
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
    scenarios,
    currentScenario,
    setCurrentScenario,
    settings,
    setSettings,
    graphRef,
    resetGraphLayout,
    selectedElementId,
    setSelectedElementId,
    centerToPosition,
    setCenterToPosition,
    needsReRendering,
    setNeedsReRendering,
    requiredUpdateStepsRef,
  };
};
