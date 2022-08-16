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
const EDGE_SELECTED_WIDTH = 3.5;
const EDGE_WIDTH = 2;
const EDGE_WIDTH_SHINY = 4;
const EDGE_SELCTED_WIDTH_SHINY = 6;

export const shinyColors = [
  '#5F95FF', // blue
  '#61DDAA', // green
  '#ffb039', // cosmogold
  '#F08BB4', // pink
  '#F6BD16', // orange
  '#7262FD', // blue
  '#78D3F8', // azure
  '#9661BC', // purple
  '#F6903D', // orange
];

export const getAssociatedClassAttribute = (attributesToAssign, currentElementGroup, associationMap) => {
  if (!associationMap.has(currentElementGroup)) {
    const usedAttributesArray = Array.from(associationMap.values());
    const freeAttributes = attributesToAssign.filter((val) => !usedAttributesArray.includes(val));
    if (freeAttributes.length > 0) {
      associationMap.set(currentElementGroup, freeAttributes[0]);
    } else {
      associationMap.set(currentElementGroup, attributesToAssign[0]);
      console.log(
        `The amount of elemet classes is bigger then the possible attributes so attributes will be used multiple times`
      );
    }
  }
  return associationMap.get(currentElementGroup);
};

// Styles details
export const getDefaultEdgeStyle = (theme) => ({
  'line-color': EDGE_DEFAULT_COLOR,
  width: EDGE_WIDTH,
});

export const getDefaultSelectedEdgeStyle = (theme) => ({
  ...getDefaultEdgeStyle(theme),
  width: EDGE_SELECTED_WIDTH,
  'line-color': EDGE_SELECTED_COLOR,
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

export const getDefaultCompoundNodeStyle = (theme) => ({
  'border-color': EDGE_DEFAULT_COLOR,
  'border-width': 0,
  'background-color': '#466282',
  'background-opacity': 0.2,
});

// Shiny styles
export const getShinyEdgeStyle = (theme) => ({
  'line-color': EDGE_DEFAULT_COLOR,
  'target-arrow-color': EDGE_DEFAULT_COLOR,
  width: EDGE_WIDTH_SHINY,
  'target-arrow-shape': 'triangle',
  'curve-style': 'bezier',
});

export const getShinySelectedEdgeStyle = (theme) => ({
  ...getShinyEdgeStyle(theme),
  width: EDGE_SELCTED_WIDTH_SHINY,
  'line-color': theme.palette.type === 'light' ? EDGE_SELECTED_COLOR : '#fff',
  // needs to depend the theme bright theme => edges rest gray, little darker, if dark: edges white
  'target-arrow-color': theme.palette.type === 'light' ? EDGE_SELECTED_COLOR : '#fff',
  'target-arrow-shape': 'triangle',
  'curve-style': 'bezier',
});

export const getShinyNodeStyle = (theme) => ({
  width: NODE_ICON_SIZE,
  height: NODE_ICON_SIZE,
  'background-opacity': 0.2,
  'border-width': 3,
  'border-opacity': 0.85,
  'font-size': NODE_LABEL_SIZE,
  'text-max-width': NODE_LABEL_MAX_WIDTH,
  'text-wrap': 'wrap',
  'min-zoomed-font-size': 5,
  color: theme.palette.text.primary,
  label: 'data(label)',
});

export const getShinySelectedNodeStyle = (theme) => ({
  ...getShinyNodeStyle(theme),
  'background-opacity': 0.85,
});

export const getShinyCompoundNodeStyle = (theme) => ({
  'border-style': 'dashed',
  'border-color': EDGE_DEFAULT_COLOR,
  'border-width': 3,
  'background-opacity': 0,
});
