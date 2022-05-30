// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import theme from '../../theme/';

// Nodes
// const NODE_DEFAULT_COLOR = '#000000';
const NODE_LABEL_SIZE = '11';
const NODE_LABEL_MAX_WIDTH = '90px';
const NODE_ICON_SIZE = '28';
const NODE_SELECTED_ICON_SIZE = '34';
const NODE_SELECTED_BLACKEN_RATIO = 0.1;
// Edges
const EDGE_DEFAULT_COLOR = '#999999';
const EDGE_SELECTED_WIDTH = 3.5;
const EDGE_WIDTH = 2;

// Styles details
export const DEFAULT_EDGE_STYLE = {
  'line-color': EDGE_DEFAULT_COLOR,
  width: EDGE_WIDTH,
};

export const DEFAULT_SELECTED_EDGE_STYLE = {
  ...DEFAULT_EDGE_STYLE,
  width: EDGE_SELECTED_WIDTH,
};

export const DEFAULT_NODE_STYLE = {
  width: NODE_ICON_SIZE,
  height: NODE_ICON_SIZE,
  'background-blacken': NODE_SELECTED_BLACKEN_RATIO,
  // 'background-color': NODE_DEFAULT_COLOR,
  'font-size': NODE_LABEL_SIZE,
  'text-max-width': NODE_LABEL_MAX_WIDTH,
  'text-wrap': 'wrap',
  'min-zoomed-font-size': 5,
  color: theme.palette.primary.contrastText,
  label: 'data(label)',
};

export const DEFAULT_SELECTED_NODE_STYLE = {
  ...DEFAULT_NODE_STYLE,
  width: NODE_SELECTED_ICON_SIZE,
  height: NODE_SELECTED_ICON_SIZE,
  'background-blacken': -NODE_SELECTED_BLACKEN_RATIO,
};
