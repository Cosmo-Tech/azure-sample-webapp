// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import dagre from '@dagrejs/dagre';

const DEFAULT_NODES_LAYOUT_OPTIONS = { width: 80, height: 96 };

const buildGraphOptions = (settings) => {
  const spacingFactor = settings.spacing / 100.0;
  return {
    marginx: 20,
    marginy: 20,
    rankdir: settings?.orientation === 'horizontal' ? 'LR' : 'TB',
    edgesep: 20 * spacingFactor,
    nodesep: 50 * spacingFactor,
    ranksep: 800 * spacingFactor,
  };
};

export const applyDagreLayout = (nodes, links, settings) => {
  const graphOptions = buildGraphOptions(settings);
  const graph = new dagre.graphlib.Graph().setGraph(graphOptions).setDefaultEdgeLabel(() => ({}));
  nodes.forEach((node) => graph.setNode(node.id, { ...DEFAULT_NODES_LAYOUT_OPTIONS }));
  links.forEach((link) => graph.setEdge(link.source.id, link.target.id));

  dagre.layout(graph);
  nodes.forEach((node) => {
    const gNode = graph.node(node.id);
    node.x = gNode.x;
    node.y = gNode.y;
    node.rank = gNode.rank;
  });
  return graph;
};
