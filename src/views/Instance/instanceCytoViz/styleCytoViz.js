// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Nodes
// const NODE_DEFAULT_COLOR = '#000000';
const NODE_LABEL_SIZE = '11';
const NODE_LABEL_MAX_WIDTH = '90px';
const NODE_ICON_SIZE = '28';
const NODE_SELECTED_ICON_SIZE = '34';
const NODE_SELECTED_BLACKEN_RATIO = 0.1;
// Edges
const EDGE_DEFAULT_COLOR = '#999999';
const EDGE_SELECTED_COLOR = '#5b5b5b';
const EDGE_SELECTED_WIDTH = 5;
const EDGE_WIDTH = 2;

// Styles details
export const getDefaultEdgeStyle = (theme) => ({
  'line-color': EDGE_DEFAULT_COLOR,
  'curve-style': 'bezier',
  width: EDGE_WIDTH,
});

export const getDefaultSelectedEdgeStyle = (theme) => ({
  ...getDefaultEdgeStyle(theme),
  width: EDGE_SELECTED_WIDTH,
  'line-color': EDGE_SELECTED_COLOR,
  'target-arrow-color': EDGE_SELECTED_COLOR,
  'target-arrow-shape': 'triangle',
});
export const getDefaultInEdgeStyle = (theme) => ({
  ...getDefaultEdgeStyle(theme),
  width: EDGE_SELECTED_WIDTH,
  'line-color': EDGE_SELECTED_COLOR,
  'line-style': 'dashed',
  'target-arrow-color': EDGE_SELECTED_COLOR,
  'target-arrow-shape': 'triangle',
});
export const getDefaultHiddenStyle = (theme) => ({
  visibility: 'hidden',
  opacity: 1,
});

export const getDefaultNodeStyle = (theme) => ({
  width: NODE_ICON_SIZE,
  height: NODE_ICON_SIZE,
  'background-blacken': NODE_SELECTED_BLACKEN_RATIO,
  // 'background-color': NODE_DEFAULT_COLOR,
  'font-size': NODE_LABEL_SIZE,
  'text-max-width': NODE_LABEL_MAX_WIDTH,
  'text-wrap': 'wrap',
  'min-zoomed-font-size': 5,
  color: theme.palette.text.primary,
  label: 'data(label)',
});

export const getDefaultSelectedNodeStyle = (theme) => ({
  ...getDefaultNodeStyle(theme),
  width: NODE_SELECTED_ICON_SIZE,
  height: NODE_SELECTED_ICON_SIZE,
  'background-blacken': -NODE_SELECTED_BLACKEN_RATIO,
});
