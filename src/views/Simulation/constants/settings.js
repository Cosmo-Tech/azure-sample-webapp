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

export const MAP_VIEW_FILTERS = [
  { value: 'all', label: 'All', type: 'checkbox' },
  { value: 'production_resources', label: 'Production resources', type: 'checkbox' },
  { value: 'production_operations', label: 'Production operations', type: 'checkbox' },
  { value: 'stocks', label: 'Stocks', type: 'checkbox' },
  { value: 'transports', label: 'Transports', type: 'checkbox' },
  { value: 'onlyCriticalPoints', label: 'Only critical points', type: 'switch' },
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
