// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
export const GRAPH_VIEW_FILTER_VALUES = {
  BOTTLENECKS: 'bottlenecks',
  SHORTAGES: 'shortages',
};

export const GRAPH_LAYOUT_DIRECTION_VALUES = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
};

export const SIMULATION_MODES = {
  GRAPH: 'graph',
  MAP: 'map',
};

export const MAP_ENTITIES = [
  { value: 'all', label: 'All' },
  { value: 'entity1', label: 'Production ressources' },
  { value: 'entity2', label: 'Production operations' },
  { value: 'entity3', label: 'Stocks' },
  { value: 'entity4', label: 'Transports' },
];

export const DEFAULT_SETTINGS = {
  graphViewFilters: [GRAPH_VIEW_FILTER_VALUES.BOTTLENECKS],
  orientation: GRAPH_LAYOUT_DIRECTION_VALUES.HORIZONTAL,
  showInput: false,
  inputLevels: 2,
  showOutput: false,
  outputLevels: 2,
  spacing: 25,
  enableGlowEffect: true,
  viewMode: SIMULATION_MODES.GRAPH,
};

export const SETTINGS_SLIDER_MIN = 5;
export const SETTINGS_SLIDER_MAX = 50;
