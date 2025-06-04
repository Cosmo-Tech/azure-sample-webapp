// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import dagre from '@dagrejs/dagre';

// If provided, 'options' must be an object, with 3 optional keys: 'graph', 'nodes' and 'edges'. These options are used
// to initialize the graph layout. For more details, see https://github.com/dagrejs/dagre/wiki#configuring-the-layout
export const applyDagreLayout = (nodes, links, options = {}) => {
  const graph = new dagre.graphlib.Graph().setGraph({ ...options.graph }).setDefaultEdgeLabel(() => ({}));

  nodes.forEach((node) => graph.setNode(node.id, { ...options.nodes }));
  links.forEach((link) => graph.setEdge(link.source.id, link.target.id, { ...options.edges }));

  dagre.layout(graph);
  nodes.forEach((node) => {
    const gNode = graph.node(node.id);
    node.x = gNode.x;
    node.y = gNode.y;
    node.rank = gNode.rank;
  });
  return graph;
};
