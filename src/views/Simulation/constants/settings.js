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

export const DEFAULT_SETTINGS = {
  graphViewFilters: [GRAPH_VIEW_FILTER_VALUES.BOTTLENECKS],
  orientation: GRAPH_LAYOUT_DIRECTION_VALUES.HORIZONTAL,
  showInput: false,
  inputLevels: 2,
  showOutput: false,
  outputLevels: 2,
  spacing: 25,
};

export const SETTINGS_SLIDER_MIN = 5;
export const SETTINGS_SLIDER_MAX = 50;
